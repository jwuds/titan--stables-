import React from 'react';
import ParagraphBlock from '../BlogBlocks/ParagraphBlock';
import HeadingBlock from '../BlogBlocks/HeadingBlock';
import ImageBlock from '../BlogBlocks/ImageBlock';
import QuoteBlock from '../BlogBlocks/QuoteBlock';
import FAQBlock from '../BlogBlocks/FAQBlock';
import ProsConsBlock from '../BlogBlocks/ProsConsBlock';
import TableBlock from '../BlogBlocks/TableBlock';
import InternalLinkBlock from '../BlogBlocks/InternalLinkBlock';
import BreedFactsBlock from '../BlogBlocks/BreedFactsBlock';
import TitleBlock from '../BlogBlocks/TitleBlock';

export default function BlockEditor({ block, onChange, isEdit = true }) {
  const props = { content: block.content || {}, onChange, isEdit };
  
  switch(block.block_type) {
    case 'paragraph': return <ParagraphBlock {...props} />;
    case 'heading': return <HeadingBlock {...props} />;
    case 'image': return <ImageBlock {...props} />;
    case 'quote': return <QuoteBlock {...props} />;
    case 'faq': return <FAQBlock {...props} />;
    case 'pros_cons': return <ProsConsBlock {...props} />;
    case 'table': return <TableBlock {...props} />;
    case 'internal_link': return <InternalLinkBlock {...props} />;
    case 'breed_facts': return <BreedFactsBlock {...props} />;
    case 'title': return <TitleBlock {...props} />;
    default: return <div className="text-red-500">Unknown block type: {block.block_type}</div>;
  }
}