import { useState, type ReactNode } from 'react';
import { Copy, Folder, Home, Plus, Search, Settings, Trash2, Users } from '@/icons';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/Accordion';
import { Alert } from '@/components/ui/Alert';
import { Avatar, AvatarGroup } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Button } from '@/components/ui/Button';
import { Calendar } from '@/components/ui/Calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/Carousel';
import { BarChart, LineChart } from '@/components/ui/Chart';
import { Checkbox } from '@/components/ui/Checkbox';
import { Combobox } from '@/components/ui/Combobox';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/CommandPalette';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@/components/ui/ContextMenu';
import { DataGrid, type DataGridColumn } from '@/components/ui/DataGrid';
import { DatePicker } from '@/components/ui/DatePicker';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/Dialog';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/Drawer';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/DropdownMenu';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { FileUpload } from '@/components/ui/FileUpload';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/Form';
import { IconButton } from '@/components/ui/IconButton';
import { Input } from '@/components/ui/Input';
import { Kbd } from '@/components/ui/Kbd';
import { MultiSelect } from '@/components/ui/MultiSelect';
import { Pagination } from '@/components/ui/Pagination';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover';
import { Progress, ProgressCircle } from '@/components/ui/Progress';
import { RadioGroup, RadioItem } from '@/components/ui/RadioGroup';
import { ScrollArea } from '@/components/ui/ScrollArea';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/Select';
import { Separator } from '@/components/ui/Separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/Sheet';
import { Sidebar, SidebarItem, SidebarSection } from '@/components/ui/Sidebar';
import { Skeleton } from '@/components/ui/Skeleton';
import { Slider } from '@/components/ui/Slider';
import { Snackbar } from '@/components/ui/Snackbar';
import { Spinner } from '@/components/ui/Spinner';
import { Stepper } from '@/components/ui/Stepper';
import { Switch } from '@/components/ui/Switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { TagInput } from '@/components/ui/TagInput';
import { Textarea } from '@/components/ui/Textarea';
import { Timeline, TimelineItem, TimelineTitle } from '@/components/ui/Timeline';
import { Toast, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from '@/components/ui/Toast';
import { Tooltip, TooltipProvider } from '@/components/ui/Tooltip';
import { TopNav, TopNavLink } from '@/components/ui/TopNav';
import { Tree } from '@/components/ui/Tree';
import { useForm } from 'react-hook-form';

export interface CatalogEntry {
  name: string;
  storyId: string;
  group: string;
  render: () => ReactNode;
}

function ComboboxDemo() {
  const [v, setV] = useState<string | null>('ts');
  return (
    <Combobox
      value={v}
      onChange={setV}
      options={[
        { value: 'go', label: 'Go' },
        { value: 'ts', label: 'TypeScript' },
        { value: 'rs', label: 'Rust' },
      ]}
      placeholder="Language"
    />
  );
}

function MultiSelectDemo() {
  const [v, setV] = useState<string[]>(['frontend']);
  return (
    <MultiSelect
      value={v}
      onChange={setV}
      options={[
        { value: 'frontend', label: 'Frontend' },
        { value: 'backend', label: 'Backend' },
        { value: 'design', label: 'Design' },
      ]}
    />
  );
}

function DatePickerDemo() {
  const [d, setD] = useState<Date | undefined>(new Date());
  return <DatePicker value={d} onChange={setD} placeholder="Pick a date" />;
}

function FormDemo() {
  const form = useForm({ defaultValues: { email: 'jane@example.com' } });
  return (
    <Form {...form}>
      <form className="w-full">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl><Input {...field} /></FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}

export function useCatalogEntries(): CatalogEntry[] {
  return [
    // ── Buttons
    {
      name: 'Button', group: 'Buttons', storyId: 'primitives-button',
      render: () => (
        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm">Primary</Button>
          <Button size="sm" variant="outline">Outline</Button>
          <Button size="sm" variant="ghost">Ghost</Button>
        </div>
      ),
    },
    {
      name: 'IconButton', group: 'Buttons', storyId: 'primitives-iconbutton',
      render: () => (
        <div className="flex items-center gap-2">
          <IconButton aria-label="Search" icon={<Search />} />
          <IconButton aria-label="Settings" variant="outline" icon={<Settings />} />
          <IconButton aria-label="Delete" variant="ghost" icon={<Trash2 />} />
        </div>
      ),
    },

    // ── Inputs
    { name: 'Input', group: 'Inputs', storyId: 'primitives-input',
      render: () => <Input placeholder="jane@example.com" defaultValue="jane@example.com" className="w-full" /> },
    { name: 'Textarea', group: 'Inputs', storyId: 'primitives-textarea',
      render: () => <Textarea placeholder="Write something…" rows={2} className="w-full" /> },
    { name: 'Select', group: 'Inputs', storyId: 'primitives-select',
      render: () => (
        <Select defaultValue="usd">
          <SelectTrigger className="w-full" placeholder="Currency" />
          <SelectContent>
            <SelectItem value="usd">US Dollar</SelectItem>
            <SelectItem value="mnt">Mongolian Tögrög</SelectItem>
          </SelectContent>
        </Select>
      ) },
    { name: 'Combobox', group: 'Inputs', storyId: 'primitives-combobox', render: () => <ComboboxDemo /> },
    { name: 'MultiSelect', group: 'Inputs', storyId: 'primitives-multiselect', render: () => <MultiSelectDemo /> },
    { name: 'Checkbox', group: 'Inputs', storyId: 'primitives-checkbox',
      render: () => (
        <div className="flex flex-col gap-1.5">
          <Checkbox label="I agree to the terms" defaultChecked />
          <Checkbox label="Remember me" />
        </div>
      ) },
    { name: 'RadioGroup', group: 'Inputs', storyId: 'primitives-radiogroup',
      render: () => (
        <RadioGroup defaultValue="monthly" className="flex flex-col gap-1.5">
          <RadioItem value="monthly" label="Monthly" />
          <RadioItem value="yearly" label="Yearly" />
        </RadioGroup>
      ) },
    { name: 'Switch', group: 'Inputs', storyId: 'primitives-switch',
      render: () => (
        <div className="flex flex-col gap-2">
          <Switch label="Email notifications" defaultChecked />
          <Switch label="SMS notifications" />
        </div>
      ) },
    { name: 'Slider', group: 'Inputs', storyId: 'primitives-slider',
      render: () => <Slider defaultValue={[40]} className="w-full" /> },
    { name: 'TagInput', group: 'Inputs', storyId: 'primitives-taginput',
      render: () => <TagInput defaultValue={['frontend', 'react']} className="w-full" /> },
    { name: 'DatePicker', group: 'Inputs', storyId: 'primitives-datepicker', render: () => <DatePickerDemo /> },
    { name: 'Calendar', group: 'Inputs', storyId: 'primitives-calendar',
      render: () => <div className="scale-75 origin-top"><Calendar mode="single" /></div> },
    { name: 'FileUpload', group: 'Inputs', storyId: 'primitives-fileupload',
      render: () => <FileUpload className="w-full" hint="PDF, PNG up to 5 MB" /> },
    { name: 'Form', group: 'Inputs', storyId: 'primitives-form', render: () => <FormDemo /> },

    // ── Feedback
    { name: 'Alert', group: 'Feedback', storyId: 'feedback-alert',
      render: () => <Alert variant="success" title="Saved">All changes published.</Alert> },
    {
      name: 'Toast', group: 'Feedback', storyId: 'feedback-toast',
      render: () => (
        <ToastProvider duration={Infinity}>
          <ToastViewport className="!static !w-full !p-0">
            <Toast open variant="success">
              <div>
                <ToastTitle>Saved</ToastTitle>
                <ToastDescription>All changes published.</ToastDescription>
              </div>
            </Toast>
          </ToastViewport>
        </ToastProvider>
      ),
    },
    { name: 'Snackbar', group: 'Feedback', storyId: 'feedback-snackbar',
      render: () => <Snackbar variant="info" title="Heads up" onClose={() => {}}>Read-only mode is on.</Snackbar> },
    { name: 'Spinner', group: 'Feedback', storyId: 'feedback-spinner',
      render: () => (
        <div className="flex items-center gap-4">
          <Spinner size="sm" label="Loading" />
          <Spinner size="md" label="Loading" />
          <Spinner size="lg" label="Loading" />
        </div>
      ) },
    { name: 'Progress', group: 'Feedback', storyId: 'feedback-progress',
      render: () => (
        <div className="flex w-full items-center gap-4">
          <Progress value={62} aria-label="Upload" className="flex-1" />
          <ProgressCircle value={72} aria-label="Storage" />
        </div>
      ) },
    { name: 'Skeleton', group: 'Feedback', storyId: 'feedback-skeleton',
      render: () => (
        <div className="flex w-full items-center gap-3">
          <Skeleton className="size-9 rounded-full" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-3 w-2/3" />
            <Skeleton className="h-3 w-1/3" />
          </div>
        </div>
      ) },
    { name: 'EmptyState', group: 'Feedback', storyId: 'feedback-emptystate',
      render: () => (
        <EmptyState
          icon={<Folder className="size-6" />}
          title="No projects"
          description="Create your first project."
          action={<Button size="sm" leadingIcon={<Plus />}>New</Button>}
        />
      ) },
    { name: 'ErrorState', group: 'Feedback', storyId: 'feedback-errorstate',
      render: () => <ErrorState variant="404" /> },

    // ── Overlays
    { name: 'Dialog', group: 'Overlays', storyId: 'overlays-dialog',
      render: () => (
        <Dialog>
          <DialogTrigger asChild><Button size="sm" variant="outline">Open dialog</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite collaborators</DialogTitle>
              <DialogDescription>They'll get an email invitation.</DialogDescription>
            </DialogHeader>
            <DialogFooter><Button>Send</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      ) },
    { name: 'Sheet', group: 'Overlays', storyId: 'overlays-sheet',
      render: () => (
        <Sheet>
          <SheetTrigger asChild><Button size="sm" variant="outline">Open sheet</Button></SheetTrigger>
          <SheetContent side="right">
            <SheetHeader><SheetTitle>Filters</SheetTitle></SheetHeader>
          </SheetContent>
        </Sheet>
      ) },
    { name: 'Drawer', group: 'Overlays', storyId: 'overlays-drawer',
      render: () => (
        <Drawer>
          <DrawerTrigger asChild><Button size="sm" variant="outline">Open drawer</Button></DrawerTrigger>
          <DrawerContent><DrawerHeader><DrawerTitle>Quick action</DrawerTitle></DrawerHeader></DrawerContent>
        </Drawer>
      ) },
    { name: 'Popover', group: 'Overlays', storyId: 'overlays-popover',
      render: () => (
        <Popover>
          <PopoverTrigger asChild><Button size="sm" variant="outline">Open popover</Button></PopoverTrigger>
          <PopoverContent>Hi from a popover.</PopoverContent>
        </Popover>
      ) },
    { name: 'Tooltip', group: 'Overlays', storyId: 'overlays-tooltip',
      render: () => (
        <TooltipProvider>
          <Tooltip label="Copy link">
            <IconButton aria-label="Copy" icon={<Copy />} variant="outline" />
          </Tooltip>
        </TooltipProvider>
      ) },
    { name: 'DropdownMenu', group: 'Overlays', storyId: 'overlays-dropdownmenu',
      render: () => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild><Button size="sm" variant="outline">Actions</Button></DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Rename</DropdownMenuItem>
            <DropdownMenuItem>Duplicate</DropdownMenuItem>
            <DropdownMenuItem className="text-danger-text">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) },
    { name: 'ContextMenu', group: 'Overlays', storyId: 'overlays-contextmenu',
      render: () => (
        <ContextMenu>
          <ContextMenuTrigger asChild>
            <div className="flex h-12 w-full items-center justify-center rounded-md border border-dashed border-border text-xs text-foreground-muted">
              Right-click me
            </div>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem>Cut</ContextMenuItem>
            <ContextMenuItem>Copy</ContextMenuItem>
            <ContextMenuItem>Paste</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      ) },
    { name: 'CommandPalette', group: 'Overlays', storyId: 'overlays-commandpalette',
      render: () => (
        <Command className="w-full rounded-md border border-border bg-card">
          <CommandInput placeholder="Type a command…" />
          <CommandList className="max-h-32">
            <CommandEmpty>No results.</CommandEmpty>
            <CommandGroup heading="Actions">
              <CommandItem>New file</CommandItem>
              <CommandItem>Invite user</CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      ) },

    // ── Navigation
    { name: 'Breadcrumbs', group: 'Navigation', storyId: 'navigation-breadcrumbs',
      render: () => (
        <Breadcrumbs items={[
          { label: 'Workspace', href: '/' },
          { label: 'Projects', href: '/projects' },
          { label: 'Atlas' },
        ]} />
      ) },
    { name: 'Tabs', group: 'Navigation', storyId: 'navigation-tabs',
      render: () => (
        <Tabs defaultValue="overview" className="w-full">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="files">Files</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="pt-2 text-xs text-foreground-muted">Tab content.</TabsContent>
        </Tabs>
      ) },
    { name: 'Stepper', group: 'Navigation', storyId: 'navigation-stepper',
      render: () => (
        <Stepper
          current={1}
          steps={[
            { title: 'Account' },
            { title: 'Team' },
            { title: 'Billing' },
          ]}
        />
      ) },
    { name: 'Pagination', group: 'Navigation', storyId: 'navigation-pagination',
      render: () => (
        <Pagination page={3} pageCount={12} totalItems={240} pageSize={20} onPageChange={() => {}} />
      ) },
    { name: 'Sidebar', group: 'Navigation', storyId: 'navigation-sidebar',
      render: () => (
        <div className="flex h-48 w-full overflow-hidden rounded-md border border-border">
          <Sidebar className="!sticky-none !h-full" defaultCollapsed={false}>
            <SidebarSection>
              <SidebarItem icon={<Home />} active>Home</SidebarItem>
              <SidebarItem icon={<Folder />}>Projects</SidebarItem>
              <SidebarItem icon={<Users />}>Members</SidebarItem>
            </SidebarSection>
          </Sidebar>
          <div className="flex-1 bg-background-subtle p-3 text-xs text-foreground-muted">Content</div>
        </div>
      ) },
    { name: 'TopNav', group: 'Navigation', storyId: 'navigation-topnav',
      render: () => (
        <div className="w-full overflow-hidden rounded-md border border-border">
          <TopNav
            logo={<span className="text-sm font-semibold">Atlas</span>}
            nav={
              <nav className="flex items-center gap-3 text-sm">
                <TopNavLink href="#" active>Home</TopNavLink>
                <TopNavLink href="#">Projects</TopNavLink>
              </nav>
            }
            actions={<Avatar fallback="BO" size="sm" />}
          />
        </div>
      ) },

    // ── Layout
    { name: 'Card', group: 'Layout', storyId: 'layout-card',
      render: () => (
        <Card className="w-full">
          <CardHeader className="p-4">
            <CardTitle className="text-sm">Project Atlas</CardTitle>
            <CardDescription>4 contributors</CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-xs text-foreground-muted">A small dashboard project.</p>
          </CardContent>
        </Card>
      ) },
    { name: 'Separator', group: 'Layout', storyId: 'layout-separator',
      render: () => (
        <div className="w-full space-y-2">
          <p className="text-xs">Above</p>
          <Separator />
          <p className="text-xs">Below</p>
        </div>
      ) },
    { name: 'ScrollArea', group: 'Layout', storyId: 'layout-scrollarea',
      render: () => (
        <ScrollArea className="h-32 w-full rounded-md border border-border p-3">
          <ul className="space-y-1 text-xs">
            {Array.from({ length: 20 }).map((_, i) => <li key={i}>Item #{i + 1}</li>)}
          </ul>
        </ScrollArea>
      ) },
    { name: 'Accordion', group: 'Layout', storyId: 'layout-accordion',
      render: () => (
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="a"><AccordionTrigger>What is the refund policy?</AccordionTrigger><AccordionContent>14 days, no questions.</AccordionContent></AccordionItem>
          <AccordionItem value="b"><AccordionTrigger>Do you support SSO?</AccordionTrigger><AccordionContent>Yes — Team plan.</AccordionContent></AccordionItem>
        </Accordion>
      ) },

    // ── Data Display
    { name: 'Badge', group: 'Data Display', storyId: 'data-display-badge',
      render: () => (
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="success" dot>Active</Badge>
          <Badge tone="warning">Pending</Badge>
          <Badge tone="danger">Failed</Badge>
          <Badge tone="accent" variant="outline">v0.5</Badge>
        </div>
      ) },
    { name: 'Avatar', group: 'Data Display', storyId: 'data-display-avatar',
      render: () => (
        <div className="flex items-center gap-3">
          <Avatar fallback="AB" status="online" />
          <Avatar fallback="CD" status="busy" />
          <AvatarGroup max={3}>
            <Avatar fallback="1" />
            <Avatar fallback="2" />
            <Avatar fallback="3" />
            <Avatar fallback="4" />
          </AvatarGroup>
        </div>
      ) },
    { name: 'Table', group: 'Data Display', storyId: 'data-display-table',
      render: () => (
        <Table>
          <TableHeader>
            <TableRow><TableHead>Project</TableHead><TableHead>Status</TableHead></TableRow>
          </TableHeader>
          <TableBody>
            <TableRow><TableCell>Atlas</TableCell><TableCell><Badge tone="success">Active</Badge></TableCell></TableRow>
            <TableRow><TableCell>Beacon</TableCell><TableCell><Badge tone="warning">Paused</Badge></TableCell></TableRow>
          </TableBody>
        </Table>
      ) },
    { name: 'DataGrid', group: 'Data Display', storyId: 'data-display-datagrid',
      render: () => {
        const cols: DataGridColumn<{id:string;name:string;status:string}>[] = [
          { key: 'name', header: 'Name', sortable: true },
          { key: 'status', header: 'Status', cell: (r) => <Badge tone="success">{r.status}</Badge> },
        ];
        return <DataGrid rows={[{id:'1',name:'Atlas',status:'Active'},{id:'2',name:'Beacon',status:'Active'}]} columns={cols} />;
      } },
    { name: 'Carousel', group: 'Data Display', storyId: 'data-display-carousel',
      render: () => (
        <Carousel className="w-full">
          <CarouselContent>
            {[1,2,3].map((i) => (
              <CarouselItem key={i}>
                <div className="flex aspect-video items-center justify-center rounded-md border border-border bg-card text-xl font-medium">
                  {i}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      ) },
    { name: 'Timeline', group: 'Data Display', storyId: 'data-display-timeline',
      render: () => (
        <Timeline className="w-full">
          <TimelineItem><TimelineTitle>Merged PR #142</TimelineTitle></TimelineItem>
          <TimelineItem><TimelineTitle>Opened PR #143</TimelineTitle></TimelineItem>
          <TimelineItem isLast><TimelineTitle>Pushed 4 commits</TimelineTitle></TimelineItem>
        </Timeline>
      ) },
    { name: 'Tree', group: 'Data Display', storyId: 'data-display-tree',
      render: () => (
        <Tree
          className="w-full"
          defaultExpanded={['src']}
          data={[
            { id: 'src', label: 'src', children: [
              { id: 'index.ts', label: 'index.ts' },
              { id: 'App.tsx', label: 'App.tsx' },
            ]},
            { id: 'README.md', label: 'README.md' },
          ]}
        />
      ) },
    { name: 'Chart', group: 'Data Display', storyId: 'data-display-chart',
      render: () => {
        const data = [22,18,26,30,35,41,38,45,50,48,56,60].map((y,i)=>({x:i,y}));
        return (
          <div className="flex w-full flex-col gap-2">
            <LineChart data={data} caption="MRR" />
            <BarChart data={data.slice(0, 6)} caption="Weekly signups" height={60} />
          </div>
        );
      } },

    // ── Typography
    { name: 'Kbd', group: 'Typography', storyId: 'typography-kbd',
      render: () => (
        <div className="flex items-center gap-2 text-sm">
          Open palette: <Kbd>⌘</Kbd> + <Kbd>K</Kbd>
        </div>
      ) },
  ];
}
