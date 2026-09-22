import ArrowLeft from 'lucide-react-native/icons/arrow-left';
import Check from 'lucide-react-native/icons/check';
import ChevronDown from 'lucide-react-native/icons/chevron-down';
import ChevronLeft from 'lucide-react-native/icons/chevron-left';
import ChevronRight from 'lucide-react-native/icons/chevron-right';
import CircleAlert from 'lucide-react-native/icons/circle-alert';
import Copy from 'lucide-react-native/icons/copy';
import Expand from 'lucide-react-native/icons/expand';
import Gem from 'lucide-react-native/icons/gem';
import Glasses from 'lucide-react-native/icons/glasses';
import Heart from 'lucide-react-native/icons/heart';
import ImageIcon from 'lucide-react-native/icons/image';
import House from 'lucide-react-native/icons/house';
import LayoutGrid from 'lucide-react-native/icons/layout-grid';
import Camera from 'lucide-react-native/icons/camera';
import Mail from 'lucide-react-native/icons/mail';
import MapPin from 'lucide-react-native/icons/map-pin';
import Minus from 'lucide-react-native/icons/minus';
import Pencil from 'lucide-react-native/icons/pencil';
import Phone from 'lucide-react-native/icons/phone';
import Plus from 'lucide-react-native/icons/plus';
import RefreshCw from 'lucide-react-native/icons/refresh-cw';
import RotateCcw from 'lucide-react-native/icons/rotate-ccw';
import Search from 'lucide-react-native/icons/search';
import ShieldCheck from 'lucide-react-native/icons/shield-check';
import ShoppingBag from 'lucide-react-native/icons/shopping-bag';
import SlidersHorizontal from 'lucide-react-native/icons/sliders-horizontal';
import Star from 'lucide-react-native/icons/star';
import Trash from 'lucide-react-native/icons/trash';
import Truck from 'lucide-react-native/icons/truck';
import User from 'lucide-react-native/icons/user';
import X from 'lucide-react-native/icons/x';
import { CustomerColors } from '@/theme/customer';

// Deep imports, not the package barrel: Metro does not reliably tree-shake and the
// barrel pulls in the entire ~1500-icon set.
const ICONS = {
  back: ArrowLeft,
  check: Check,
  'chevron-down': ChevronDown,
  'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight,
  alert: CircleAlert,
  copy: Copy,
  expand: Expand,
  heart: Heart,
  glasses: Glasses,
  gem: Gem,
  image: ImageIcon,
  home: House,
  grid: LayoutGrid,
  camera: Camera,
  mail: Mail,
  'map-pin': MapPin,
  minus: Minus,
  pencil: Pencil,
  phone: Phone,
  plus: Plus,
  refresh: RefreshCw,
  'rotate-ccw': RotateCcw,
  search: Search,
  shield: ShieldCheck,
  bag: ShoppingBag,
  sliders: SlidersHorizontal,
  star: Star,
  trash: Trash,
  shipping: Truck,
  user: User,
  close: X,
} as const;

export type IconName = keyof typeof ICONS;

interface Props {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
  fill?: string;
}

export function Icon({
  name,
  size = 20,
  color = CustomerColors.text,
  strokeWidth = 1.75,
  fill = 'none',
}: Props) {
  const Glyph = ICONS[name];
  return <Glyph size={size} color={color} strokeWidth={strokeWidth} fill={fill} />;
}
