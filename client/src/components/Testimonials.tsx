export default function Testimonials() {
  const testimonials = [
    {
      name: 'Александр П.',
      role: 'IT-директор',
      content: 'Решил проблему с назойливыми звонками и спамом. Теперь мои данные под надежной защитой.'
    },
    {
      name: 'Мария С.',
      role: 'Маркетолог',
      content: 'Очень довольна сервисом! После удаления моих данных значительно сократилось количество спама.'
    },
    {
      name: 'Дмитрий К.',
      role: 'Предприниматель',
      content: 'ReScrub помог мне вернуть контроль над моими личными данными. Отличный сервис с понятным интерфейсом.'
    },
    {
      name: 'Елена Р.',
      role: 'Юрист',
      content: 'Как юрист, оцениваю соответствие 152-ФЗ. Сервис действительно помогает защитить права граждан.'
    }
  ];

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header - Cal.com style */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Что говорят клиенты
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Отзывы тех, кто доверил нам защиту своих данных
          </p>
        </div>

        {/* Testimonials grid - minimal Cal.com style */}
        <div className="mx-auto mt-16 flow-root max-w-2xl sm:mt-20 lg:mx-0 lg:max-w-none">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="pt-8 sm:inline-block sm:w-full sm:px-4"
                data-testid={`testimonial-${index}`}
              >
                <figure className="text-center">
                  <blockquote className="text-lg font-semibold leading-8 text-foreground sm:text-xl sm:leading-9">
                    <p>"{testimonial.content}"</p>
                  </blockquote>
                  <figcaption className="mt-10">
                    <div className="mt-4 flex items-center justify-center space-x-3 text-base">
                      <div className="font-semibold text-foreground">
                        {testimonial.name}
                      </div>
                      <svg
                        viewBox="0 0 2 2"
                        width={3}
                        height={3}
                        aria-hidden="true"
                        className="fill-muted-foreground"
                      >
                        <circle cx={1} cy={1} r={1} />
                      </svg>
                      <div className="text-muted-foreground">
                        {testimonial.role}
                      </div>
                    </div>
                  </figcaption>
                </figure>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}