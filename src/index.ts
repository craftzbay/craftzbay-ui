/**
 * Library entry — re-exports primitives, patterns, hooks, and utilities.
 */

// Utilities
export * from './lib/utils';
export * from './lib/cva';

// Hooks
export * from './hooks/use-media-query';
export * from './hooks/use-toast';

// Icons (namespaced to avoid name collisions with consumer apps)
export * as Icons from './icons';

// Illustrations — refined-minimal line art for empty / error / 404 states
export * as Illustrations from './illustrations';

// Primitives
export * from './components/ui/Accordion';
export * from './components/ui/Alert';
export * from './components/ui/Avatar';
export * from './components/ui/Badge';
export * from './components/ui/Breadcrumbs';
export * from './components/ui/Button';
export * from './components/ui/Card';
export * from './components/ui/Checkbox';
export * from './components/ui/Combobox';
export * from './components/ui/CommandPalette';
export * from './components/ui/ContextMenu';
export * from './components/ui/DataGrid';
export * from './components/ui/DatePicker';
export * from './components/ui/Dialog';
export * from './components/ui/DropdownMenu';
export * from './components/ui/EmptyState';
export * from './components/ui/ErrorState';
export * from './components/ui/Form';
export * from './components/ui/IconButton';
export * from './components/ui/Input';
export * from './components/ui/Kbd';
export * from './components/ui/MultiSelect';
export * from './components/ui/Pagination';
export * from './components/ui/Popover';
export * from './components/ui/Progress';
export * from './components/ui/RadioGroup';
export * from './components/ui/ScrollArea';
export * from './components/ui/Select';
export * from './components/ui/Separator';
export * from './components/ui/Sheet';
export * from './components/ui/Sidebar';
export * from './components/ui/Skeleton';
export * from './components/ui/Slider';
export * from './components/ui/Spinner';
export * from './components/ui/Stepper';
export * from './components/ui/Switch';
export * from './components/ui/Table';
export * from './components/ui/Tabs';
export * from './components/ui/Textarea';
export * from './components/ui/Toast';
export * from './components/ui/Tooltip';
export * from './components/ui/TopNav';

// New in 0.2.0
export * from './components/ui/Calendar';
export * from './components/ui/Carousel';
export * from './components/ui/Chart';
export * from './components/ui/Drawer';
export * from './components/ui/FileUpload';
export * from './components/ui/Snackbar';
export * from './components/ui/TagInput';
export * from './components/ui/Timeline';
export * from './components/ui/Tree';

// Patterns
export * from './components/patterns/Authentication';
export * from './components/patterns/AppShell';
export * from './components/patterns/Settings';
export * from './components/patterns/DataTablePage';
export * from './components/patterns/RecordDetail';
export * from './components/patterns/Onboarding';
export * from './components/patterns/Pricing';
export * from './components/patterns/FirstRunEmpty';
