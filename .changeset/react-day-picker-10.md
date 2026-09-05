---
'@craftzbay/ui': patch
---

`Calendar` and `DatePicker` run on react-day-picker 10. The library only ever used
the v9 API that v10 keeps (`startMonth`/`endMonth`, `hidden`, `captionLayout`,
`classNames`, `components`, `labels`), so `CalendarProps` and `DatePickerProps` are
unchanged; `DatePicker`'s `fromDate`/`toDate` are its own props and still map to
`disabled` matchers.
