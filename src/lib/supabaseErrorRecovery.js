
/**
 * Supabase Error Recovery and Circuit Breaker
 * Automatic retry, fallback data, graceful degradation
 */

import { supabase } from '@/lib/customSupabaseClient';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second base delay
const TIMEOUT_MS = 30000; // 30 seconds
const CIRCUIT_BREAKER_THRESHOLD = 5; // failures before opening circuit
const CIRCUIT_BREAKER_TIMEOUT = 60000; // 1 minute before attempting retry

// Circuit breaker state
const circuitBreakers = new Map();

/**
 * Circuit Breaker States
 */
const CIRCUIT_STATES = {
  CLOSED: 'CLOSED', // Normal operation
  OPEN: 'OPEN', // Service failing, reject requests
  HALF_OPEN: 'HALF_OPEN', // Testing if service recovered
};

/**
 * Circuit Breaker class
 */
class CircuitBreaker {
  constructor(name) {
    this.name = name;
    this.state = CIRCUIT_STATES.CLOSED;
    this.failureCount = 0;
    this.lastFailureTime = null;
    this.successCount = 0;
  }

  recordSuccess() {
    this.failureCount = 0;
    this.successCount++;
    
    if (this.state === CIRCUIT_STATES.HALF_OPEN) {
      this.state = CIRCUIT_STATES.CLOSED;
      console.log(`✅ Circuit breaker ${this.name} recovered (CLOSED)`);
    }
  }

  recordFailure() {
    this.failureCount++;
    this.lastFailureTime = Date.now();
    this.successCount = 0;

    if (this.failureCount >= CIRCUIT_BREAKER_THRESHOLD) {
      this.state = CIRCUIT_STATES.OPEN;
      console.warn(`🔴 Circuit breaker ${this.name} OPEN (${this.failureCount} failures)`);
    }
  }

  canAttempt() {
    if (this.state === CIRCUIT_STATES.CLOSED) {
      return true;
    }

    if (this.state === CIRCUIT_STATES.OPEN) {
      const timeSinceLastFailure = Date.now() - this.lastFailureTime;
      
      if (timeSinceLastFailure >= CIRCUIT_BREAKER_TIMEOUT) {
        this.state = CIRCUIT_STATES.HALF_OPEN;
        console.log(`🟡 Circuit breaker ${this.name} HALF_OPEN (testing recovery)`);
        return true;
      }
      
      return false;
    }

    if (this.state === CIRCUIT_STATES.HALF_OPEN) {
      return true;
    }

    return false;
  }

  getState() {
    return {
      name: this.name,
      state: this.state,
      failureCount: this.failureCount,
      successCount: this.successCount,
      lastFailureTime: this.lastFailureTime,
    };
  }
}

/**
 * Get or create circuit breaker
 */
const getCircuitBreaker = (name) => {
  if (!circuitBreakers.has(name)) {
    circuitBreakers.set(name, new CircuitBreaker(name));
  }
  return circuitBreakers.get(name);
};

/**
 * Fetch with retry and exponential backoff
 */
export const fetchWithRetry = async (fetchFn, options = {}) => {
  const {
    retries = MAX_RETRIES,
    timeout = TIMEOUT_MS,
    onRetry,
    fallbackData,
  } = options;

  let lastError;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      // Add timeout
      const result = await Promise.race([
        fetchFn(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Request timeout')), timeout)
        ),
      ]);

      return result;
    } catch (error) {
      lastError = error;
      
      if (attempt < retries) {
        const delay = RETRY_DELAY * Math.pow(2, attempt);
        console.warn(`Retry attempt ${attempt + 1}/${retries} after ${delay}ms:`, error.message);
        
        if (onRetry) onRetry(attempt, delay, error);
        
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  console.error('All retry attempts failed:', lastError);

  if (fallbackData !== undefined) {
    console.log('Using fallback data');
    return fallbackData;
  }

  throw lastError;
};

/**
 * Execute with circuit breaker protection
 */
export const withCircuitBreaker = async (serviceName, fetchFn, fallbackData) => {
  const breaker = getCircuitBreaker(serviceName);

  if (!breaker.canAttempt()) {
    console.warn(`Circuit breaker ${serviceName} is OPEN, using fallback`);
    
    if (fallbackData !== undefined) {
      return fallbackData;
    }
    
    throw new Error(`Service ${serviceName} is temporarily unavailable (circuit breaker OPEN)`);
  }

  try {
    const result = await fetchWithRetry(fetchFn, { fallbackData });
    breaker.recordSuccess();
    return result;
  } catch (error) {
    breaker.recordFailure();
    throw error;
  }
};

/**
 * Get fallback data from various sources
 */
export const getFallbackData = (key, defaultValue = null) => {
  // Try localStorage
  try {
    const cached = localStorage.getItem(`fallback_${key}`);
    if (cached) {
      const parsed = JSON.parse(cached);
      console.log(`Using localStorage fallback for ${key}`);
      return parsed;
    }
  } catch (error) {
    console.warn('localStorage fallback failed:', error);
  }

  // Return default value
  return defaultValue;
};

/**
 * Store fallback data
 */
export const storeFallbackData = (key, data) => {
  try {
    localStorage.setItem(`fallback_${key}`, JSON.stringify(data));
  } catch (error) {
    console.warn('Failed to store fallback data:', error);
  }
};

/**
 * Handle Supabase errors with user-friendly messages
 */
export const handleSupabaseError = (error, context = '') => {
  const errorMessages = {
    'Network request failed': 'Unable to connect to the server. Please check your internet connection.',
    'timeout': 'The request took too long to complete. Please try again.',
    'Failed to fetch': 'Network error. Please check your connection and try again.',
    'JWT expired': 'Your session has expired. Please log in again.',
    'Invalid JWT': 'Authentication error. Please log in again.',
    'Row level security': 'You do not have permission to access this resource.',
    'violates unique constraint': 'This record already exists.',
    'violates foreign key constraint': 'Cannot perform this action due to related data.',
  };

  let userMessage = 'An unexpected error occurred. Please try again.';

  // Find matching error message
  for (const [key, message] of Object.entries(errorMessages)) {
    if (error.message?.includes(key)) {
      userMessage = message;
      break;
    }
  }

  const errorInfo = {
    message: userMessage,
    originalError: error.message,
    context,
    timestamp: new Date().toISOString(),
  };

  console.error('Supabase error:', errorInfo);

  // Log to error_logs table (non-blocking)
  logError(errorInfo).catch(() => {});

  return errorInfo;
};

/**
 * Log error to Supabase
 */
const logError = async (errorInfo) => {
  try {
    await supabase.from('error_logs').insert([{
      error_message: errorInfo.message,
      error_stack: errorInfo.originalError,
      page_path: window.location.pathname,
      severity: 'error',
      timestamp: errorInfo.timestamp,
    }]);
  } catch (err) {
    console.warn('Failed to log error to database:', err);
  }
};

/**
 * Check service health
 */
export const checkServiceHealth = async () => {
  try {
    const startTime = Date.now();
    
    const { data, error } = await supabase
      .from('health_checks')
      .select('id')
      .limit(1);

    const duration = Date.now() - startTime;

    if (error) {
      return {
        healthy: false,
        error: error.message,
        duration,
      };
    }

    return {
      healthy: true,
      duration,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    return {
      healthy: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    };
  }
};

/**
 * Graceful degradation wrapper
 */
export const withGracefulDegradation = async (primaryFn, fallbackFn) => {
  try {
    return await primaryFn();
  } catch (error) {
    console.warn('Primary function failed, using fallback:', error);
    return await fallbackFn();
  }
};

/**
 * Get all circuit breaker states
 */
export const getCircuitBreakerStates = () => {
  const states = [];
  circuitBreakers.forEach((breaker) => {
    states.push(breaker.getState());
  });
  return states;
};

/**
 * Reset circuit breaker
 */
export const resetCircuitBreaker = (name) => {
  const breaker = circuitBreakers.get(name);
  if (breaker) {
    breaker.state = CIRCUIT_STATES.CLOSED;
    breaker.failureCount = 0;
    breaker.successCount = 0;
    console.log(`Circuit breaker ${name} manually reset`);
  }
};

/**
 * Batch requests with error handling
 */
export const batchRequestsWithRecovery = async (requests, options = {}) => {
  const { continueOnError = true } = options;
  
  const results = [];
  
  for (const request of requests) {
    try {
      const result = await withCircuitBreaker(
        request.name || 'batch_request',
        request.fn,
        request.fallback
      );
      results.push({ success: true, data: result });
    } catch (error) {
      results.push({ success: false, error: handleSupabaseError(error, request.name) });
      
      if (!continueOnError) {
        break;
      }
    }
  }
  
  return results;
};
