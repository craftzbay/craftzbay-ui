/**
 * Templates are "blocks" — complete pages composed from @craftzbay/ui
 * primitives, shipped as copy-paste source rather than importable components.
 * The registry lives in ../blocks/registry; this module re-exports it under
 * the names the rest of the showcase already uses.
 */
export type { BlockDoc as TemplateDoc } from '../blocks/registry';
export { blockDocs as templateDocs, getBlockDoc as getTemplateDoc } from '../blocks/registry';
