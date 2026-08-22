import { defineDict } from './locale';

/**
 * E-commerce template copy — chrome, labels and the demo catalogue.
 * Glossary: Cart = Сагс · Checkout = Төлбөр төлөх · Wishlist = Хүслийн жагсаалт ·
 * Shipping = Хүргэлт · Returns = Буцаалт · Support = Тусламж.
 */
export const ecommerceDict = defineDict({
  en: {
    // Categories
    'cat.all': 'All',
    'cat.audio': 'Audio',
    'cat.wearables': 'Wearables',
    'cat.home': 'Home',
    'cat.accessories': 'Accessories',

    // Header
    'nav.openMenu': 'Open menu',
    'nav.shop': 'Shop',
    'nav.categories': 'Categories',
    'nav.search': 'Search',
    'nav.searchProducts': 'Search products',
    'nav.searchPlaceholder': 'Search products…',
    'nav.closeSearch': 'Close search',
    'nav.cart': 'Cart',

    // Shop
    'shop.title': 'New arrivals',
    'shop.subtitle': 'Thoughtfully made gear for everyday use.',
    'shop.empty.title': 'No products found',
    'shop.empty.query': 'Nothing matches “{query}” in {category}.',
    'shop.empty.category': 'Nothing in {category} right now.',
    'shop.clearFilters': 'Clear filters',
    'shop.view': 'View {name}',
    'shop.wishAdd': 'Add {name} to wishlist',
    'shop.wishRemove': 'Remove {name} from wishlist',
    'shop.back': 'Back to shop',

    // Product
    'product.reviews': '· {n} reviews',
    'product.description':
      'Reference-grade 40mm drivers, adaptive noise cancellation and a 40-hour battery. Machined aluminium, recycled fabric, and a case that finally fits in a pocket.',
    'product.addToCart': 'Add to cart',
    'product.spec.battery': 'Battery',
    'product.spec.batteryValue': '40 hours',
    'product.spec.weight': 'Weight',
    'product.spec.weightValue': '248 g',
    'product.spec.warranty': 'Warranty',
    'product.spec.warrantyValue': '2 years',
    'product.notFound.title': 'Product not found',
    'product.notFound.body': 'It may have sold out or the link is out of date.',
    'qty.decrease': 'Decrease',
    'qty.increase': 'Increase',

    // Cart
    'cart.title': 'Your cart',
    'cart.empty.title': 'Your cart is empty',
    'cart.empty.body': 'Browse the shop and add something you like.',
    'cart.continue': 'Continue shopping',
    'cart.remove': 'Remove {name}',
    'cart.subtotal': 'Subtotal',
    'cart.shipping': 'Shipping',
    'cart.total': 'Total',
    'cart.checkout': 'Checkout',

    // Footer / help
    'footer.copyright': '© {year} Shop demo. Prices are placeholders.',
    'footer.help': 'Help',
    'help.more': 'More help',
    'help.shipping.title': 'Shipping',
    'help.shipping.body':
      'Orders ship within 1–2 business days. Standard delivery is $9 flat; free over $150. Tracking arrives by email as soon as the parcel leaves the warehouse.',
    'help.returns.title': 'Returns',
    'help.returns.body':
      'Return anything within 30 days in its original condition for a full refund. Start a return from your order page — the label is prepaid.',
    'help.support.title': 'Support',
    'help.support.body':
      'We answer within one business day. Include your order number so we can look it up straight away.',

    // Catalogue
    'item.aura': 'Aura Wireless Headphones',
    'item.pulse': 'Pulse Smartwatch',
    'item.lumen': 'Lumen Desk Lamp',
    'item.drift': 'Drift Earbuds',
    'item.field': 'Field Backpack',
    'item.nest': 'Nest Speaker',
  },
  mn: {
    'cat.all': 'Бүгд',
    'cat.audio': 'Аудио',
    'cat.wearables': 'Зүүдэг төхөөрөмж',
    'cat.home': 'Гэр ахуй',
    'cat.accessories': 'Нэмэлт хэрэгсэл',

    'nav.openMenu': 'Цэс нээх',
    'nav.shop': 'Дэлгүүр',
    'nav.categories': 'Ангилал',
    'nav.search': 'Хайх',
    'nav.searchProducts': 'Бараа хайх',
    'nav.searchPlaceholder': 'Бараа хайх…',
    'nav.closeSearch': 'Хайлт хаах',
    'nav.cart': 'Сагс',

    'shop.title': 'Шинэ бараа',
    'shop.subtitle': 'Өдөр тутмын хэрэглээнд зориулж нямбай урласан бараа.',
    'shop.empty.title': 'Бараа олдсонгүй',
    'shop.empty.query': '{category} ангилалд «{query}» гэсэн үр дүн алга.',
    'shop.empty.category': '{category} ангилалд одоогоор бараа алга.',
    'shop.clearFilters': 'Шүүлтүүр цэвэрлэх',
    'shop.view': 'Үзэх: {name}',
    'shop.wishAdd': 'Хүслийн жагсаалтад нэмэх: {name}',
    'shop.wishRemove': 'Хүслийн жагсаалтаас хасах: {name}',
    'shop.back': 'Дэлгүүр рүү буцах',

    'product.reviews': '· {n} үнэлгээ',
    'product.description':
      'Мэргэжлийн түвшний 40мм драйвер, дасан зохицох дуу тусгаарлалт, 40 цагийн батерей. Хөнгөн цагаан хийц, дахин боловсруулсан даавуу, халаасанд багтах гэр.',
    'product.addToCart': 'Сагсанд нэмэх',
    'product.spec.battery': 'Батерей',
    'product.spec.batteryValue': '40 цаг',
    'product.spec.weight': 'Жин',
    'product.spec.weightValue': '248г',
    'product.spec.warranty': 'Баталгаа',
    'product.spec.warrantyValue': '2 жил',
    'product.notFound.title': 'Бараа олдсонгүй',
    'product.notFound.body': 'Бараа дууссан эсвэл холбоос хуучирсан байж магадгүй.',
    'qty.decrease': 'Хасах',
    'qty.increase': 'Нэмэх',

    'cart.title': 'Таны сагс',
    'cart.empty.title': 'Сагс хоосон байна',
    'cart.empty.body': 'Дэлгүүрээс таалагдсан бараагаа нэмнэ үү.',
    'cart.continue': 'Үргэлжлүүлэн худалдан авах',
    'cart.remove': 'Хасах: {name}',
    'cart.subtotal': 'Барааны дүн',
    'cart.shipping': 'Хүргэлт',
    'cart.total': 'Нийт',
    'cart.checkout': 'Төлбөр төлөх',

    'footer.copyright': '© {year} Дэлгүүрийн демо. Үнэ нь жишээ утга.',
    'footer.help': 'Тусламж',
    'help.more': 'Бусад тусламж',
    'help.shipping.title': 'Хүргэлт',
    'help.shipping.body':
      'Захиалгыг 1–2 ажлын өдөрт илгээнэ. Энгийн хүргэлт 31,000₮; 512,000₮-өөс дээш захиалгад үнэгүй. Илгээмж агуулахаас гармагц хянах дугаарыг имэйлээр илгээнэ.',
    'help.returns.title': 'Буцаалт',
    'help.returns.body':
      'Барааг 30 хоногийн дотор анхны байдлаар нь буцаавал төлбөрийг бүрэн буцаан олгоно. Буцаалтыг захиалгын хуудаснаас эхлүүлнэ — илгээмжийн төлбөрийг бид хариуцна.',
    'help.support.title': 'Тусламж',
    'help.support.body':
      'Нэг ажлын өдрийн дотор хариулна. Шууд шалгахын тулд захиалгын дугаараа хавсаргана уу.',

    'item.aura': 'Aura утасгүй чихэвч',
    'item.pulse': 'Pulse ухаалаг цаг',
    'item.lumen': 'Lumen ширээний гэрэл',
    'item.drift': 'Drift чихний чихэвч',
    'item.field': 'Field үүргэвч',
    'item.nest': 'Nest чанга яригч',
  },
});
