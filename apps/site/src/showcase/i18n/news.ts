import { defineDict } from './locale';

/**
 * News template copy — chrome, labels and the demo article content.
 * Glossary: Section = Хэсэг · Story = Нийтлэл · Trending = Их уншсан ·
 * Latest = Сүүлийн үеийн · Newsletter = Мэдээний захиа.
 */
export const newsDict = defineDict({
  en: {
    // Categories
    'cat.all': 'All',
    'cat.world': 'World',
    'cat.business': 'Business',
    'cat.technology': 'Technology',
    'cat.science': 'Science',
    'cat.culture': 'Culture',
    'cat.sport': 'Sport',

    // Masthead
    'nav.menu': 'Menu',
    'nav.sections': 'Sections',
    'nav.subscribe': 'Subscribe',
    'nav.search': 'Search',
    'nav.searchStories': 'Search stories',
    'nav.searchPlaceholder': 'Search stories…',
    'nav.closeSearch': 'Close search',

    // Front page
    'front.latest': 'Latest',
    'front.trending': 'Trending',
    'front.empty.title': 'No stories found',
    'front.empty.query': 'Nothing matches “{query}” in {section}.',
    'front.empty.anySection': 'any section',
    'front.empty.section': 'Nothing in {section} yet.',
    'front.clearFilters': 'Clear filters',

    // Newsletter
    'newsletter.title': 'The Daily Brief',
    'newsletter.body': 'Top stories in your inbox each morning.',
    'newsletter.email': 'Email address',
    'newsletter.placeholder': 'you@example.com',
    'newsletter.signUp': 'Sign up',
    'newsletter.signUpFree': 'Sign up free',

    // Footer
    'footer.tagline':
      'Independent reporting on technology, business, science and culture — every day.',
    'footer.sections': 'Footer sections',
    'footer.legal': 'Legal',
    'footer.rights': '. All rights reserved.',

    // Legal pages
    'legal.privacy.title': 'Privacy',
    'legal.privacy.body':
      'We collect only what the newsletter needs — your email address — and never sell it. Unsubscribe from any issue in one click.',
    'legal.terms.title': 'Terms',
    'legal.terms.body':
      'Articles are free to read and link to. Republishing full text requires written permission; excerpts with attribution are welcome.',
    'legal.contact.title': 'Contact',
    'legal.contact.body':
      'Tips, corrections and press enquiries reach the newsroom desk within one business day.',

    // Article
    'article.back': 'Back to front page',
    'article.readTime': '{n} min read',
    'article.notFound.title': 'Story not found',
    'article.notFound.body': 'It may have been unpublished or the link is out of date.',
    'article.body.1':
      'For years the boundary between design and engineering was a stack of hand-offs. A new generation of token-driven libraries is quietly erasing it — and teams are shipping measurably faster as a result.',
    'article.body.2':
      'The shift is subtle. Instead of pixel specs, designers ship semantic tokens; instead of re-implementing them, engineers consume the same source of truth. Themes become data, and dark mode stops being a project.',
    'article.body.3':
      '“We stopped arguing about spacing,” one lead told us. “The system decides, and we get our afternoons back.” That sentiment — less debate, more shipping — came up again and again across the dozen teams we spoke to.',

    // Demo stories
    'story.design-systems.title': 'The quiet design system revolution reshaping the web',
    'story.design-systems.excerpt':
      'How token-driven UI libraries are collapsing the gap between design and code.',
    'story.markets-pause.title': 'Markets steady as central banks signal a pause',
    'story.markets-pause.excerpt':
      'Investors weigh softer inflation against a cooling labour market.',
    'story.deep-sea-survey.title': 'Deep-sea survey finds dozens of unknown species',
    'story.deep-sea-survey.excerpt':
      'A months-long expedition mapped ridges no instrument had reached before.',
    'story.long-form-essay.title': 'The slow return of the long-form essay',
    'story.long-form-essay.excerpt':
      'Readers are paying for depth again — and writers are noticing.',
  },
  mn: {
    'cat.all': 'Бүгд',
    'cat.world': 'Дэлхий',
    'cat.business': 'Эдийн засаг',
    'cat.technology': 'Технологи',
    'cat.science': 'Шинжлэх ухаан',
    'cat.culture': 'Соёл',
    'cat.sport': 'Спорт',

    'nav.menu': 'Цэс',
    'nav.sections': 'Хэсгүүд',
    'nav.subscribe': 'Захиалах',
    'nav.search': 'Хайх',
    'nav.searchStories': 'Нийтлэл хайх',
    'nav.searchPlaceholder': 'Нийтлэл хайх…',
    'nav.closeSearch': 'Хайлт хаах',

    'front.latest': 'Сүүлийн үеийн',
    'front.trending': 'Их уншсан',
    'front.empty.title': 'Нийтлэл олдсонгүй',
    'front.empty.query': '{section} хэсэгт «{query}» гэсэн үр дүн алга.',
    'front.empty.anySection': 'Бүх',
    'front.empty.section': '{section} хэсэгт нийтлэл алга.',
    'front.clearFilters': 'Шүүлтүүр цэвэрлэх',

    'newsletter.title': 'Өглөөний тойм',
    'newsletter.body': 'Өглөө бүр гол мэдээг имэйлээр хүргэнэ.',
    'newsletter.email': 'Имэйл',
    'newsletter.placeholder': 'name@example.com',
    'newsletter.signUp': 'Бүртгүүлэх',
    'newsletter.signUpFree': 'Үнэгүй бүртгүүлэх',

    'footer.tagline':
      'Технологи, эдийн засаг, шинжлэх ухаан, соёлын хараат бус сэтгүүл зүй — өдөр бүр.',
    'footer.sections': 'Хөлийн хэсгүүд',
    'footer.legal': 'Хууль эрх зүй',
    'footer.rights': '. Бүх эрх хуулиар хамгаалагдсан.',

    'legal.privacy.title': 'Нууцлал',
    'legal.privacy.body':
      'Мэдээний захиад зөвхөн имэйл хаяг л хэрэгтэй — үүнээс өөр мэдээлэл цуглуулахгүй, хэнд ч худалдахгүй. Дурын дугаараас нэг товшилтоор захиалгаа цуцална.',
    'legal.terms.title': 'Үйлчилгээний нөхцөл',
    'legal.terms.body':
      'Нийтлэлийг үнэгүй уншиж, холбоос тавьж болно. Бүтэн эхийг дахин нийтлэхэд бичгээр зөвшөөрөл шаардана; эх сурвалжаа дурдсан хэсэгчилсэн ишлэлийг хүлээн зөвшөөрнө.',
    'legal.contact.title': 'Холбоо барих',
    'legal.contact.body':
      'Мэдээлэл, залруулга, хэвлэлийн хүсэлтэд редакц нэг ажлын өдрийн дотор хариулна.',

    'article.back': 'Нүүр хуудас руу буцах',
    'article.readTime': '{n} мин унших',
    'article.notFound.title': 'Нийтлэл олдсонгүй',
    'article.notFound.body': 'Нийтлэл устгагдсан эсвэл холбоос хуучирсан байж магадгүй.',
    'article.body.1':
      'Олон жилийн турш дизайн, инженерчлэлийн хооронд гар дамжуулалтын урт гинж байсаар ирлээ. Токенд суурилсан шинэ үеийн сангууд энэ хилийг аажмаар арилгаж, багууд бүтээгдэхүүнээ мэдэгдэхүйц хурдан гаргах болжээ.',
    'article.body.2':
      'Өөрчлөлт нь нүдэнд төдийлөн тусахгүй. Дизайнерууд пикселийн зураглалын оронд утга бүхий токен хүлээлгэн өгч, инженерүүд дахин бичихийн оронд нэг эх сурвалжаас шууд ашигладаг болсон. Загвар нь өгөгдөл болж, харанхуй горим тусдаа төсөл байхаа больжээ.',
    'article.body.3':
      '«Зай завсрын талаар маргахаа больсон» гэж нэг багийн ахлагч бидэнд ярьсан. «Систем өөрөө шийддэг, бид үдээс хойшхи цагаа буцааж авсан.» Маргаан бага, ажил их гэсэн энэ сэтгэгдэл бидний ярилцсан арав гаруй багт дахин дахин давтагдлаа.',

    'story.design-systems.title': 'Вэбийг чимээгүйхэн өөрчилж буй дизайн системийн хувьсгал',
    'story.design-systems.excerpt':
      'Токенд суурилсан UI сангууд дизайн, кодын хоорондох зайг хэрхэн арилгаж байна вэ.',
    'story.markets-pause.title': 'Төв банкууд хүлээх дохио өгсөнөөр зах зээл тогтворжив',
    'story.markets-pause.excerpt':
      'Хөрөнгө оруулагчид инфляцын бууралтыг хөдөлмөрийн зах зээлийн сулралтай харьцуулан дэнслэж байна.',
    'story.deep-sea-survey.title': 'Далайн гүний судалгаагаар хэдэн арван шинэ зүйл илрүүлэв',
    'story.deep-sea-survey.excerpt':
      'Хэдэн сар үргэлжилсэн экспедиц өмнө нь ямар ч багаж хүрч байгаагүй нуруудын зураглалыг хийлээ.',
    'story.long-form-essay.title': 'Урт эсээ аажмаар эргэн ирж байна',
    'story.long-form-essay.excerpt':
      'Уншигчид гүн агуулгын төлөө дахин мөнгө төлж эхэлсэн нь зохиолчдын анхаарлыг татлаа.',
  },
});
