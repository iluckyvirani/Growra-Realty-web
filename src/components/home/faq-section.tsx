"use client";

import { getFaqs } from "@/services/property-service";
import { FadeIn } from "@/components/animations/fade-in";
import { SectionHeading } from "@/components/common/section-heading";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function FaqSection() {
  const faqs = getFaqs();

  return (
    <section id="faq" className="section-padding">
      <div className="container-luxury max-w-3xl">
        <SectionHeading
          eyebrow="Support"
          title="Frequently asked questions"
          subtitle="Clear answers to help you buy, rent, and invest with confidence."
          align="center"
        />

        <FadeIn>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id}>
                <AccordionTrigger className="text-base">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-base leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </FadeIn>
      </div>
    </section>
  );
}
