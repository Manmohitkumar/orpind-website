export default function Certifications() {
  const certifications = [
    'USDA Organic',
    'India Organic',
    'FSSAI',
    'Non-GMO',
    'Gluten-Free',
  ];

  return (
    <section className="section-padding bg-beige-200">
      <div className="container-custom">
        <h4 className="heading-4 text-green-600 text-center mb-12">Certified Organic</h4>
        <div className="flex flex-wrap justify-center gap-6">
          {certifications.map((cert) => (
            <div
              key={cert}
              className="bg-beige-50 rounded-lg px-8 py-6 shadow-soft-sm hover:shadow-soft-md transition-shadow"
            >
              <p className="text-sm font-semibold text-green-600 tracking-wide whitespace-nowrap">{cert}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
