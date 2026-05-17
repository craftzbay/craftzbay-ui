import { useState, type ReactNode } from 'react';
import { ChevronRight, File as FileIcon, Folder, FolderOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TreeNode {
  id: string;
  label: ReactNode;
  /** If undefined the node is a leaf; if empty array it is an empty folder. */
  children?: TreeNode[];
  /** Optional custom icon (overrides default file/folder icons). */
  icon?: ReactNode;
}

export interface TreeProps {
  /** The root nodes. */
  data: TreeNode[];
  /** Ids to expand by default. */
  defaultExpanded?: string[];
  /** Currently selected node id. */
  selectedId?: string;
  onSelect?: (id: string) => void;
  className?: string;
}

/**
 * Expandable file-tree style list. Single selection. Keyboard a11y is
 * handled at the row level (`tabIndex`, Enter, ArrowRight/Left to toggle).
 */
export function Tree({ data, defaultExpanded = [], selectedId, onSelect, className }: TreeProps) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set(defaultExpanded));

  const toggle = (id: string) =>
    setExpanded((cur) => {
      const next = new Set(cur);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  function renderNode(node: TreeNode, depth: number): ReactNode {
    const hasChildren = !!node.children;
    const isOpen = expanded.has(node.id);
    const isSelected = selectedId === node.id;
    const DefaultIcon = hasChildren ? (isOpen ? FolderOpen : Folder) : FileIcon;

    return (
      <li key={node.id} role="treeitem" aria-expanded={hasChildren ? isOpen : undefined}>
        <button
          type="button"
          tabIndex={0}
          onClick={() => {
            onSelect?.(node.id);
            if (hasChildren) toggle(node.id);
          }}
          onKeyDown={(e) => {
            if (e.key === 'ArrowRight' && hasChildren && !isOpen) toggle(node.id);
            else if (e.key === 'ArrowLeft' && hasChildren && isOpen) toggle(node.id);
          }}
          style={{ paddingLeft: depth * 16 + 8 }}
          className={cn(
            'flex w-full items-center gap-1.5 rounded-md py-1 pr-2 text-left text-sm',
            'hover:bg-background-muted focus-visible:bg-background-muted outline-none',
            isSelected && 'bg-accent-soft text-foreground',
          )}
        >
          {hasChildren ? (
            <ChevronRight
              className={cn('size-3.5 shrink-0 text-foreground-subtle transition-transform', isOpen && 'rotate-90')}
              aria-hidden
            />
          ) : (
            <span className="w-3.5 shrink-0" aria-hidden />
          )}
          {node.icon ?? <DefaultIcon className="size-4 shrink-0 text-foreground-muted" aria-hidden />}
          <span className="truncate">{node.label}</span>
        </button>
        {hasChildren && isOpen && (
          <ul role="group" className="mt-0.5">
            {node.children!.map((c) => renderNode(c, depth + 1))}
          </ul>
        )}
      </li>
    );
  }

  return (
    <ul role="tree" className={cn('flex flex-col gap-0.5', className)}>
      {data.map((n) => renderNode(n, 0))}
    </ul>
  );
}
