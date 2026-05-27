
import {
  Type,
  AlignLeft,
  Mail,
  Hash,
  ChevronDownSquare,
  ListChecks,
  CheckSquare,
  Star,
  CalendarDays,
  Link2,
  Minus,
  Upload
} from "lucide-react"

export const FIELD_TYPES = [
  {
    type: "short_text",
    label: "Short text",
    icon: Type,
  },
  {
    type: "long_text",
    label: "Long text",
    icon: AlignLeft,
  },
  {
    type: "email",
    label: "Email",
    icon: Mail,
  },
  {
    type: "number",
    label: "Number",
    icon: Hash,
  },
  {
    type: "select",
    label: "Dropdown",
    icon: ChevronDownSquare,
  },
  {
    type: "multi_select",
    label: "Multi select",
    icon: ListChecks,
  },
  {
    type: "checkbox",
    label: "Checkbox",
    icon: CheckSquare,
  },
  {
    type: "rating",
    label: "Rating",
    icon: Star,
  },
  {
    type: "date",
    label: "Date",
    icon: CalendarDays,
  },
  {
    type: "url",
    label: "URL",
    icon: Link2,
  },
  {
    type: "section",
    label: "Section",
    icon: Minus,
  },
  {
    type: "file_upload",
    label: "Upload",
    icon: Upload,
  },
] as const