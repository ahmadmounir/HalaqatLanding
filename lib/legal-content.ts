import type { Language } from "@/lib/i18n";

export type LegalDocumentType = "privacy" | "terms";

type LegalSection = {
  title: string;
  items: string[];
};

type LegalDocumentContent = {
  title: string;
  lastUpdatedLabel: string;
  lastUpdated: string;
  aboutTitle: string;
  aboutText: string;
  sections: LegalSection[];
};

type LegalLocaleContent = {
  backToHome: string;
  switchLanguage: string;
  privacy: LegalDocumentContent;
  terms: LegalDocumentContent;
};

export const legalContent: Record<Language, LegalLocaleContent> = {
  en: {
    backToHome: "Back to Home",
    switchLanguage: "Switch language",
    privacy: {
      title: "Privacy Policy",
      lastUpdatedLabel: "Last updated",
      lastUpdated: "2026-04-28",
      aboutTitle: "Purpose",
      aboutText:
        "This Privacy Policy explains how we collect, use, store, and protect personal data when you use our web project.",
      sections: [
        {
          title: "Data Collection",
          items: [
            "We may collect identity and contact information you provide, such as name and email address.",
            "We may collect technical and usage data, including IP address, browser type, device details, visited pages, and interaction logs.",
            "We collect only data necessary for operating, securing, and improving the service.",
          ],
        },
        {
          title: "Cookies",
          items: [
            "We use essential cookies to keep the service functional and secure.",
            "We may use analytics cookies to understand usage patterns and improve performance.",
            "You can control cookies through browser settings; disabling some cookies may affect features.",
          ],
        },
        {
          title: "How We Use Data",
          items: [
            "To provide and maintain the service.",
            "To improve product quality, reliability, and security.",
            "To respond to support requests and important service communications.",
          ],
        },
        {
          title: "Third-Party Services",
          items: [
            "We may use third-party providers for hosting, analytics, and communication tools.",
            "These providers process data under their own terms and privacy policies.",
            "We select providers with reasonable safeguards and contractual protections.",
          ],
        },
        {
          title: "GDPR and KVKK Compliance",
          items: [
            "Personal data is processed on lawful bases under GDPR and in line with KVKK (Law No. 6698).",
            "Users may request access, correction, deletion, restriction, portability, or objection where applicable.",
            "You may withdraw consent at any time where processing is based on consent.",
          ],
        },
        {
          title: "Data Retention and Security",
          items: [
            "We retain personal data only for as long as necessary for legal and operational purposes.",
            "We apply organizational and technical measures to protect data from unauthorized access, loss, or misuse.",
          ],
        },
      ],
    },
    terms: {
      title: "Terms of Service",
      lastUpdatedLabel: "Last updated",
      lastUpdated: "2026-04-28",
      aboutTitle: "Purpose",
      aboutText:
        "These Terms of Service define the rules and responsibilities for accessing and using our web project.",
      sections: [
        {
          title: "User Responsibilities",
          items: [
            "You agree to use the service lawfully, fairly, and in good faith.",
            "You are responsible for the accuracy of information submitted through your account or forms.",
            "You must not use the service for harmful, abusive, fraudulent, or illegal activity.",
          ],
        },
        {
          title: "Acceptable Use",
          items: [
            "Do not attempt unauthorized access, reverse engineering, or disruption of the service.",
            "Do not upload content that violates rights, laws, or public policy.",
            "We may suspend or terminate access for violations.",
          ],
        },
        {
          title: "Third-Party Services",
          items: [
            "Some features may rely on third-party integrations or external links.",
            "We are not responsible for the availability or policies of third-party platforms.",
            "Your use of third-party services is governed by their own terms.",
          ],
        },
        {
          title: "Privacy and Data Protection",
          items: [
            "Use of the service is also governed by our Privacy Policy.",
            "Data handling is designed to align with GDPR and KVKK requirements where applicable.",
          ],
        },
        {
          title: "Liability and Disclaimer",
          items: [
            "The service is provided on an 'as is' and 'as available' basis.",
            "To the maximum extent allowed by law, we are not liable for indirect or consequential damages arising from service use.",
          ],
        },
        {
          title: "Changes to Terms",
          items: [
            "We may update these Terms when legal, technical, or business requirements change.",
            "Continued use of the service after updates means you accept the revised Terms.",
          ],
        },
      ],
    },
  },
  ar: {
    backToHome: "العودة إلى الرئيسية",
    switchLanguage: "تغيير اللغة",
    privacy: {
      title: "سياسة الخصوصية",
      lastUpdatedLabel: "آخر تحديث",
      lastUpdated: "2026-04-28",
      aboutTitle: "الغرض",
      aboutText:
        "توضح سياسة الخصوصية هذه كيفية جمع البيانات الشخصية واستخدامها وتخزينها وحمايتها عند استخدام مشروع الويب الخاص بنا.",
      sections: [
        {
          title: "جمع البيانات",
          items: [
            "قد نجمع بيانات الهوية والتواصل التي تقدمها، مثل الاسم والبريد الإلكتروني.",
            "قد نجمع بيانات تقنية واستخدامية مثل عنوان IP ونوع المتصفح ومعلومات الجهاز وسجلات التفاعل.",
            "نقوم بجمع البيانات الضرورية فقط لتشغيل الخدمة وتأمينها وتحسينها.",
          ],
        },
        {
          title: "ملفات تعريف الارتباط",
          items: [
            "نستخدم ملفات تعريف ارتباط أساسية للحفاظ على عمل الخدمة وأمانها.",
            "قد نستخدم ملفات تحليلية لفهم أنماط الاستخدام وتحسين الأداء.",
            "يمكنك التحكم في ملفات الارتباط من إعدادات المتصفح، وقد يؤثر تعطيل بعضها على الميزات.",
          ],
        },
        {
          title: "كيفية استخدام البيانات",
          items: [
            "لتقديم الخدمة وصيانتها.",
            "لتحسين جودة المنتج والاعتمادية والأمان.",
            "للرد على طلبات الدعم ورسائل الخدمة المهمة.",
          ],
        },
        {
          title: "خدمات الجهات الخارجية",
          items: [
            "قد نستخدم مزودي خدمات خارجيين للاستضافة والتحليلات وأدوات التواصل.",
            "تعالج هذه الجهات البيانات وفق شروطها وسياسات الخصوصية الخاصة بها.",
            "نختار مزودين لديهم ضمانات معقولة وحماية تعاقدية.",
          ],
        },
        {
          title: "الامتثال لـ GDPR وKVKK",
          items: [
            "تتم معالجة البيانات الشخصية على أسس قانونية وفق GDPR وبما يتوافق مع KVKK (القانون رقم 6698).",
            "يحق للمستخدم طلب الوصول أو التصحيح أو الحذف أو التقييد أو النقل أو الاعتراض حيثما ينطبق.",
            "يمكنك سحب الموافقة في أي وقت عندما تكون المعالجة قائمة على الموافقة.",
          ],
        },
        {
          title: "الاحتفاظ بالبيانات وأمنها",
          items: [
            "نحتفظ بالبيانات الشخصية فقط للمدة اللازمة للأغراض القانونية والتشغيلية.",
            "نطبق تدابير تنظيمية وتقنية لحماية البيانات من الوصول غير المصرح به أو الفقدان أو إساءة الاستخدام.",
          ],
        },
      ],
    },
    terms: {
      title: "شروط الخدمة",
      lastUpdatedLabel: "آخر تحديث",
      lastUpdated: "2026-04-28",
      aboutTitle: "الغرض",
      aboutText:
        "تحدد شروط الخدمة هذه القواعد والمسؤوليات الخاصة بالوصول إلى مشروع الويب الخاص بنا واستخدامه.",

      sections: [
        {
          title: "مسؤوليات المستخدم",
          items: [
            "توافق على استخدام الخدمة بشكل قانوني وعادل وبحسن نية.",
            "أنت مسؤول عن دقة المعلومات المقدمة عبر الحساب أو النماذج.",
            "يجب عدم استخدام الخدمة لأي نشاط ضار أو مسيء أو احتيالي أو غير قانوني.",
          ],
        },
        {
          title: "الاستخدام المقبول",
          items: [
            "يُمنع محاولة الوصول غير المصرح به أو الهندسة العكسية أو تعطيل الخدمة.",
            "يُمنع رفع محتوى ينتهك الحقوق أو القوانين أو النظام العام.",
            "يجوز لنا تعليق أو إنهاء الوصول عند المخالفة.",
          ],
        },
        {
          title: "خدمات الجهات الخارجية",
          items: [
            "قد تعتمد بعض الميزات على تكاملات خارجية أو روابط خارجية.",
            "لا نتحمل مسؤولية توفر أو سياسات المنصات الخارجية.",
            "يخضع استخدامك للخدمات الخارجية لشروط تلك الجهات.",
          ],
        },
        {
          title: "الخصوصية وحماية البيانات",
          items: [
            "يخضع استخدام الخدمة أيضًا لسياسة الخصوصية الخاصة بنا.",
            "تم تصميم معالجة البيانات بما يتوافق مع متطلبات GDPR وKVKK حيثما ينطبق.",
          ],
        },
        {
          title: "المسؤولية وإخلاء الضمان",
          items: [
            "تُقدم الخدمة على أساس \"كما هي\" و\"حسب التوفر\".",
            "إلى أقصى حد يسمح به القانون، لا نتحمل مسؤولية الأضرار غير المباشرة أو التبعية الناتجة عن استخدام الخدمة.",
          ],
        },
        {
          title: "تعديل الشروط",
          items: [
            "يجوز لنا تحديث هذه الشروط عند تغير المتطلبات القانونية أو التقنية أو التجارية.",
            "استمرارك في استخدام الخدمة بعد التحديث يعني قبولك للشروط المعدلة.",
          ],
        },
      ],
    },
  },
  tr: {
    backToHome: "Ana Sayfaya Dön",
    switchLanguage: "Dili değiştir",
    privacy: {
      title: "Gizlilik Politikası",
      lastUpdatedLabel: "Son güncelleme",
      lastUpdated: "2026-04-28",
      aboutTitle: "Amaç",
      aboutText:
        "Bu Gizlilik Politikası, web projemizi kullanırken kişisel verilerin nasıl toplandığını, kullanıldığını, saklandığını ve korunduğunu açıklar.",
      sections: [
        {
          title: "Veri Toplama",
          items: [
            "Ad ve e-posta gibi sağladığınız kimlik ve iletişim verilerini toplayabiliriz.",
            "IP adresi, tarayıcı türü, cihaz bilgisi ve etkileşim kayıtları gibi teknik ve kullanım verilerini toplayabiliriz.",
            "Yalnızca hizmeti işletmek, güvenliğini sağlamak ve geliştirmek için gerekli verileri toplarız.",
          ],
        },
        {
          title: "Çerezler",
          items: [
            "Hizmetin çalışması ve güvenliği için zorunlu çerezler kullanırız.",
            "Kullanım eğilimlerini anlamak ve performansı artırmak için analitik çerezler kullanabiliriz.",
            "Çerezleri tarayıcı ayarlarınızdan yönetebilirsiniz; bazı çerezleri kapatmak özellikleri etkileyebilir.",
          ],
        },
        {
          title: "Verileri Nasıl Kullanıyoruz",
          items: [
            "Hizmeti sunmak ve sürdürmek için.",
            "Ürün kalitesini, güvenilirliğini ve güvenliğini artırmak için.",
            "Destek taleplerine ve önemli hizmet iletişimlerine yanıt vermek için.",
          ],
        },
        {
          title: "Üçüncü Taraf Hizmetler",
          items: [
            "Barındırma, analitik ve iletişim araçları için üçüncü taraf sağlayıcılar kullanabiliriz.",
            "Bu sağlayıcılar verileri kendi şart ve gizlilik politikalarına göre işler.",
            "Makul güvenlik ve sözleşmesel koruma sunan sağlayıcıları tercih ederiz.",
          ],
        },
        {
          title: "GDPR ve KVKK Uyumluluğu",
          items: [
            "Kişisel veriler GDPR kapsamındaki hukuki dayanaklarla ve KVKK (6698 sayılı Kanun) ile uyumlu şekilde işlenir.",
            "Kullanıcılar, uygulanabildiği ölçüde erişim, düzeltme, silme, kısıtlama, taşıma ve itiraz haklarını kullanabilir.",
            "İşleme açık rızaya dayanıyorsa, rızanızı istediğiniz zaman geri çekebilirsiniz.",
          ],
        },
        {
          title: "Veri Saklama ve Güvenlik",
          items: [
            "Kişisel verileri yalnızca yasal ve operasyonel amaçlar için gerekli süre boyunca saklarız.",
            "Yetkisiz erişim, kayıp veya kötüye kullanıma karşı idari ve teknik önlemler uygularız.",
          ],
        },
      ],
    },
    terms: {
      title: "Hizmet Şartları",
      lastUpdatedLabel: "Son güncelleme",
      lastUpdated: "2026-04-28",
      aboutTitle: "Amaç",
      aboutText:
        "Bu Hizmet Şartları, web projemize erişim ve kullanım için geçerli kuralları ve sorumlulukları tanımlar.",
      sections: [
        {
          title: "Kullanıcı Sorumlulukları",
          items: [
            "Hizmeti hukuka uygun, adil ve iyi niyetli şekilde kullanmayı kabul edersiniz.",
            "Hesap veya formlar üzerinden gönderilen bilgilerin doğruluğundan siz sorumlusunuz.",
            "Hizmet zararlı, kötüye kullanım içeren, dolandırıcılık amaçlı veya yasa dışı faaliyetler için kullanılamaz.",
          ],
        },
        {
          title: "Kabul Edilebilir Kullanım",
          items: [
            "Yetkisiz erişim, tersine mühendislik veya hizmeti bozma girişimleri yasaktır.",
            "Hakları, yasaları veya kamu düzenini ihlal eden içerik yüklenemez.",
            "İhlal durumunda erişim askıya alınabilir veya sonlandırılabilir.",
          ],
        },
        {
          title: "Üçüncü Taraf Hizmetler",
          items: [
            "Bazı özellikler üçüncü taraf entegrasyonlarına veya harici bağlantılara dayanabilir.",
            "Üçüncü taraf platformların erişilebilirliği veya politikalarından sorumlu değiliz.",
            "Üçüncü taraf hizmetlerin kullanımı kendi şartlarına tabidir.",
          ],
        },
        {
          title: "Gizlilik ve Veri Koruma",
          items: [
            "Hizmetin kullanımı ayrıca Gizlilik Politikamıza tabidir.",
            "Veri işleme, uygulanabildiği ölçüde GDPR ve KVKK gereklilikleriyle uyumlu olacak şekilde tasarlanmıştır.",
          ],
        },
        {
          title: "Sorumluluk ve Feragat",
          items: [
            "Hizmet 'olduğu gibi' ve 'mevcut olduğu şekilde' sunulur.",
            "Yasanın izin verdiği azami ölçüde, hizmet kullanımından doğan dolaylı veya sonuçsal zararlardan sorumlu değiliz.",
          ],
        },
        {
          title: "Şartlarda Değişiklikler",
          items: [
            "Yasal, teknik veya iş gereksinimleri değiştiğinde bu Şartları güncelleyebiliriz.",
            "Güncellemeden sonra hizmeti kullanmaya devam etmeniz, revize Şartları kabul ettiğiniz anlamına gelir.",
          ],
        },
      ],
    },
  },
};
