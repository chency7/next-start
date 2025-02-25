import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';

function clsx(...args: any) {
  return args.filter(Boolean).join(' ');
}

export const CustomMDXComponents = {
  h1: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className={clsx('mt-2 text-4xl font-bold tracking-tight', className)} {...props} />
  ),
  h2: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      className={clsx(
        'mt-10 border-b border-b-zinc-800 pb-1 text-3xl font-semibold tracking-tight first:mt-0',
        className
      )}
      {...props}
    />
  ),
  h3: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className={clsx('mt-8 text-2xl font-semibold tracking-tight', className)} {...props} />
  ),
  h4: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h4 className={clsx('mt-8 text-xl font-semibold tracking-tight', className)} {...props} />
  ),
  h5: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h5 className={clsx('mt-8 text-lg font-semibold tracking-tight', className)} {...props} />
  ),
  h6: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h6 className={clsx('mt-8 text-base font-semibold tracking-tight', className)} {...props} />
  ),
  a: ({ className, href, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    const isInternalLink = href?.startsWith('/');
    if (isInternalLink) {
      return (
        <Link
          href={href || ''}
          className={clsx(
            'font-medium text-zinc-900 underline underline-offset-4 dark:text-zinc-100',
            className
          )}
          {...props}
        />
      );
    }
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={clsx(
          'font-medium text-zinc-900 underline underline-offset-4 dark:text-zinc-100',
          className
        )}
        {...props}
      />
    );
  },
  p: ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className={clsx('leading-7 [&:not(:first-child)]:mt-6', className)} {...props} />
  ),
  ul: ({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className={clsx('my-6 ml-6 list-disc', className)} {...props} />
  ),
  ol: ({ className, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className={clsx('my-6 ml-6 list-decimal', className)} {...props} />
  ),
  li: ({ className, ...props }: React.HTMLAttributes<HTMLLIElement>) => (
    <li className={clsx('mt-2', className)} {...props} />
  ),
  blockquote: ({ className, ...props }: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className={clsx(
        'mt-6 border-l-2 border-zinc-300 pl-6 italic text-zinc-800 dark:border-zinc-700 dark:text-zinc-200 [&>*]:text-zinc-600 dark:[&>*]:text-zinc-400',
        className
      )}
      {...props}
    />
  ),
  img: ({ className, alt, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={clsx('rounded-md border border-zinc-200 dark:border-zinc-700', className)}
      alt={alt}
      {...props}
    />
  ),
  hr: ({ ...props }) => (
    <hr className="my-4 border-zinc-200 md:my-8 dark:border-zinc-700" {...props} />
  ),
  table: ({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="my-6 w-full overflow-y-auto">
      <table className={clsx('w-full', className)} {...props} />
    </div>
  ),
  tr: ({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
    <tr
      className={clsx(
        'm-0 border-t border-zinc-300 p-0 even:bg-zinc-100 dark:border-zinc-700 dark:even:bg-zinc-800',
        className
      )}
      {...props}
    />
  ),
  th: ({ className, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <th
      className={clsx(
        'border border-zinc-200 px-4 py-2 text-left font-bold dark:border-zinc-700 [&[align=center]]:text-center [&[align=right]]:text-right',
        className
      )}
      {...props}
    />
  ),
  td: ({ className, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <td
      className={clsx(
        'border border-zinc-200 px-4 py-2 text-left dark:border-zinc-700 [&[align=center]]:text-center [&[align=right]]:text-right',
        className
      )}
      {...props}
    />
  ),
  pre: ({ className, ...props }: React.HTMLAttributes<HTMLPreElement>) => {
    // 获取子元素中的代码块
    const childrenArray = React.Children.toArray(props.children);
    const codeElement = childrenArray.find(
      (child) => React.isValidElement(child) && child.type === 'code'
    ) as React.ReactElement | undefined;

    // 提取语言类名
    const language = codeElement?.props?.className?.replace(/^language-/, '') || '';
    const isLanguageSpecified = !!language && language !== 'text';

    return (
      <div className="relative">
        {isLanguageSpecified && (
          <div className="absolute right-4 top-4 z-10 rounded bg-zinc-800 px-2 py-1 text-xs font-medium text-zinc-100">
            {language}
          </div>
        )}
        <pre
          className={clsx(
            'mb-4 mt-6 overflow-x-auto rounded-lg bg-zinc-900 p-4 dark:bg-zinc-950',
            className
          )}
          {...props}
        />
      </div>
    );
  },
  code: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => {
    // 检查是否是代码块的一部分(具有language-前缀的类名)
    const isCodeBlock = /^language-/.test(className || '');

    if (isCodeBlock) {
      return <code className={clsx('relative text-sm text-zinc-50', className)} {...props} />;
    }

    // 行内代码
    return (
      <code
        className={clsx(
          'relative rounded border bg-zinc-300 bg-opacity-25 px-[0.3rem] py-[0.2rem] font-mono text-sm text-zinc-600 dark:bg-zinc-700 dark:bg-opacity-25 dark:text-zinc-300',
          className
        )}
        {...props}
      />
    );
  },
  Image,
};

interface MdxProps {
  code: string;
}

// export function Mdx({ code }: MdxProps) {
//   const Component = useMDXComponent(code);

//   return (
//     <div className="mdx">
//       <Component components={components} />
//     </div>
//   );
// }

// export const CustomMDXComponents = {
//   // 标题
//   h1: (props: any) => <h1 className="mb-4 mt-8 text-3xl font-bold" {...props} />,
//   h2: (props: any) => <h2 className="mb-4 mt-8 text-2xl font-bold" {...props} />,
//   h3: (props: any) => <h3 className="mb-4 mt-6 text-xl font-bold" {...props} />,
//   h4: (props: any) => <h4 className="mb-4 mt-6 text-lg font-bold" {...props} />,

//   // 段落
//   p: (props: any) => <p className="mb-4 leading-7" {...props} />,

//   // 链接
//   a: ({ href, children, ...props }: any) => {
//     if (href?.startsWith('/')) {
//       return (
//         <Link href={href} className="text-blue-600 hover:underline" {...props}>
//           {children}
//         </Link>
//       );
//     }
//     return (
//       <a
//         href={href}
//         target="_blank"
//         rel="noopener noreferrer"
//         className="text-blue-600 hover:underline"
//         {...props}
//       >
//         {children}
//       </a>
//     );
//   },

//   // 列表
//   ul: (props: any) => <ul className="mb-4 ml-6 list-disc" {...props} />,
//   ol: (props: any) => <ol className="mb-4 ml-6 list-decimal" {...props} />,
//   li: (props: any) => <li className="mb-2" {...props} />,

//   // 引用
//   blockquote: (props: any) => (
//     <blockquote className="mb-4 border-l-4 border-gray-200 pl-4 italic" {...props} />
//   ),

//   // 图片
//   img: ({ src, alt, ...props }: any) => (
//     <div className="my-8">
//       <Image src={src} alt={alt || ''} width={800} height={400} className="rounded-lg" {...props} />
//       {alt && <p className="mt-2 text-center text-sm text-gray-500">{alt}</p>}
//     </div>
//   ),

//   // 代码块
//   pre: (props: any) => (
//     <pre className="mb-4 overflow-x-auto rounded-lg bg-gray-900 p-4 text-white">
//       {props.children}
//     </pre>
//   ),

//   // 行内代码
//   code: (props: any) => (
//     <code className="rounded bg-gray-100 px-1 py-0.5 text-red-500" {...props} />
//   ),

//   // 表格
//   table: (props: any) => (
//     <div className="my-6 w-full overflow-x-auto">
//       <table className="w-full border-collapse" {...props} />
//     </div>
//   ),
//   th: (props: any) => (
//     <th className="border border-gray-200 bg-gray-50 px-4 py-2 text-left font-bold" {...props} />
//   ),
//   td: (props: any) => <td className="border border-gray-200 px-4 py-2" {...props} />,

//   // 分割线
//   hr: () => <hr className="my-8 border-t border-gray-200" />,
// };
