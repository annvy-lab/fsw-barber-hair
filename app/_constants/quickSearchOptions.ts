import { Scissors, Smile, Eye, Droplets } from "lucide-react";

interface QuickSearchOption {
  icon: React.ElementType;
  title: string;
}

const quickSearchOptions: QuickSearchOption[] = [
  { icon: Scissors, title: "cabelo" },
  { icon: Smile, title: "barba" },
  { icon: Eye, title: "sobrancelha" },
  { icon: Droplets, title: "hidratação" }
];


export default quickSearchOptions;