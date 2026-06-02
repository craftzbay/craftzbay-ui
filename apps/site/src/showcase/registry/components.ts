import type { ComponentDoc } from './types';

/* -----------------------------------------------------------------------------
 *  Component docs are authored one-per-file under src/showcase/components/.
 *  Each file default-exports a ComponentDoc. This registry imports them all
 *  and exposes a flat array + lookup helpers.
 * --------------------------------------------------------------------------- */

import buttonDoc from '../components/Button.docs';
import iconButtonDoc from '../components/IconButton.docs';
import paginationDoc from '../components/Pagination.docs';

import inputDoc from '../components/Input.docs';
import textareaDoc from '../components/Textarea.docs';
import selectDoc from '../components/Select.docs';
import comboboxDoc from '../components/Combobox.docs';
import multiSelectDoc from '../components/MultiSelect.docs';
import checkboxDoc from '../components/Checkbox.docs';
import radioGroupDoc from '../components/RadioGroup.docs';
import switchDoc from '../components/Switch.docs';
import sliderDoc from '../components/Slider.docs';
import datePickerDoc from '../components/DatePicker.docs';
import calendarDoc from '../components/Calendar.docs';
import fileUploadDoc from '../components/FileUpload.docs';
import tagInputDoc from '../components/TagInput.docs';
import formDoc from '../components/Form.docs';

import alertDoc from '../components/Alert.docs';
import toastDoc from '../components/Toast.docs';
import snackbarDoc from '../components/Snackbar.docs';
import spinnerDoc from '../components/Spinner.docs';
import progressDoc from '../components/Progress.docs';
import skeletonDoc from '../components/Skeleton.docs';
import emptyStateDoc from '../components/EmptyState.docs';
import errorStateDoc from '../components/ErrorState.docs';

import dialogDoc from '../components/Dialog.docs';
import sheetDoc from '../components/Sheet.docs';
import drawerDoc from '../components/Drawer.docs';
import popoverDoc from '../components/Popover.docs';
import tooltipDoc from '../components/Tooltip.docs';
import dropdownMenuDoc from '../components/DropdownMenu.docs';
import contextMenuDoc from '../components/ContextMenu.docs';
import commandPaletteDoc from '../components/CommandPalette.docs';

import breadcrumbsDoc from '../components/Breadcrumbs.docs';
import tabsDoc from '../components/Tabs.docs';
import stepperDoc from '../components/Stepper.docs';
import sidebarDoc from '../components/Sidebar.docs';
import topNavDoc from '../components/TopNav.docs';

import cardDoc from '../components/Card.docs';
import separatorDoc from '../components/Separator.docs';
import scrollAreaDoc from '../components/ScrollArea.docs';
import accordionDoc from '../components/Accordion.docs';

import badgeDoc from '../components/Badge.docs';
import avatarDoc from '../components/Avatar.docs';
import tableDoc from '../components/Table.docs';
import dataGridDoc from '../components/DataGrid.docs';
import carouselDoc from '../components/Carousel.docs';
import timelineDoc from '../components/Timeline.docs';
import treeDoc from '../components/Tree.docs';
import chartDoc from '../components/Chart.docs';

import kbdDoc from '../components/Kbd.docs';

export const componentDocs: ComponentDoc[] = [
  // Buttons
  buttonDoc,
  iconButtonDoc,
  paginationDoc,

  // Inputs
  inputDoc,
  textareaDoc,
  selectDoc,
  comboboxDoc,
  multiSelectDoc,
  checkboxDoc,
  radioGroupDoc,
  switchDoc,
  sliderDoc,
  datePickerDoc,
  calendarDoc,
  fileUploadDoc,
  tagInputDoc,
  formDoc,

  // Feedback
  alertDoc,
  toastDoc,
  snackbarDoc,
  spinnerDoc,
  progressDoc,
  skeletonDoc,
  emptyStateDoc,
  errorStateDoc,

  // Overlays
  dialogDoc,
  sheetDoc,
  drawerDoc,
  popoverDoc,
  tooltipDoc,
  dropdownMenuDoc,
  contextMenuDoc,
  commandPaletteDoc,

  // Navigation
  breadcrumbsDoc,
  tabsDoc,
  stepperDoc,
  sidebarDoc,
  topNavDoc,

  // Layout
  cardDoc,
  separatorDoc,
  scrollAreaDoc,
  accordionDoc,

  // Data Display
  badgeDoc,
  avatarDoc,
  tableDoc,
  dataGridDoc,
  carouselDoc,
  timelineDoc,
  treeDoc,
  chartDoc,

  // Typography
  kbdDoc,
];

export function getComponentDoc(slug: string): ComponentDoc | undefined {
  return componentDocs.find((d) => d.slug === slug);
}

export function getRelatedDocs(slugs: string[]): ComponentDoc[] {
  return slugs
    .map((s) => getComponentDoc(s))
    .filter((d): d is ComponentDoc => Boolean(d));
}
