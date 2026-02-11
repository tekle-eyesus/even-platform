import React from "react";
import { NodeViewWrapper, NodeViewContent } from "@tiptap/react";
import { ChevronDown } from "lucide-react";

export default function CodeBlockComponent({
  node,
  updateAttributes,
  extension,
}) {
  const { language: defaultLanguage } = extension.options;

  return (
    <NodeViewWrapper className='code-block relative my-6 rounded-lg border border-zinc-200 bg-zinc-50 overflow-hidden shadow-sm group'>
      {/* Header: Language Selector */}
      <div
        className='flex items-center justify-between px-4 py-2 bg-zinc-100 border-b border-zinc-200 select-none'
        contentEditable={false} // Crucial: Prevents cursor from getting stuck here
      >
        <div className='relative'>
          <select
            contentEditable={false}
            defaultValue={node.attrs.language || defaultLanguage}
            onChange={(event) =>
              updateAttributes({ language: event.target.value })
            }
            className='appearance-none bg-transparent text-xs font-bold text-zinc-600 uppercase tracking-wide focus:outline-none cursor-pointer pr-6'
          >
            <option value='null'>auto</option>
            <option disabled>—</option>
            {extension.options.lowlight.listLanguages().map((lang, index) => (
              <option key={index} value={lang}>
                {lang}
              </option>
            ))}
          </select>
          <ChevronDown className='w-3 h-3 text-zinc-400 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none' />
        </div>

        <span className='text-[10px] text-zinc-400 font-mono'>
          {node.attrs.language ? node.attrs.language : "text"}
        </span>
      </div>

      {/* The Actual Code Content */}
      <pre className='!bg-zinc-50 !p-4 !m-0 !rounded-none'>
        <NodeViewContent
          as='code'
          className='font-mono text-sm leading-relaxed'
        />
      </pre>
    </NodeViewWrapper>
  );
}
