"use client";

import { useState } from "react";
import { services } from "@/lib/services";
import ArrowIcon from "@/components/arrow-icon";
import ServiceIcon from "@/components/service-icon";

export default function ServicesExplorer() {
  const [selected, setSelected] = useState(0);
  const service = services[selected];

  return (
    <div className="services-explorer">
      <div className="services-select" role="tablist" aria-label="Explore services" aria-orientation="vertical">
        {services.map((item, index) => (
          <button
            className={selected === index ? "service-option is-active" : "service-option"}
            type="button"
            role="tab"
            id={`service-tab-${index}`}
            aria-controls="service-detail-panel"
            aria-selected={selected === index}
            tabIndex={selected === index ? 0 : -1}
            key={item.number}
            onClick={() => setSelected(index)}
            onKeyDown={(event) => {
              if (!["ArrowDown", "ArrowUp", "ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) return;
              event.preventDefault();
              const forward = event.key === "ArrowDown" || event.key === "ArrowRight";
              const next = event.key === "Home" ? 0 : event.key === "End" ? services.length - 1 :
                (selected + (forward ? 1 : -1) + services.length) % services.length;
              setSelected(next);
              document.getElementById(`service-tab-${next}`)?.focus();
            }}
          >
            <span className="service-option-number">{item.number}</span>
            <span>{item.title}</span>
            <span className="service-option-arrow" aria-hidden="true"><ArrowIcon diagonal /></span>
          </button>
        ))}
      </div>
      <div className="service-stage" role="tabpanel" id="service-detail-panel" aria-labelledby={`service-tab-${selected}`} key={service.number}>
        <div className="service-stage-top">
          <span className="service-stage-icon"><ServiceIcon name={service.icon} /></span>
          <span>CAPABILITY / {service.number}</span>
        </div>
        <div className="service-stage-content">
          <p className="section-label">WHAT WE CAN BUILD</p>
          <h3>{service.title}</h3>
          <p>{service.description}</p>
          <div className="service-stage-tags">
            {service.deliverables.map((item) => <span key={item}>{item}</span>)}
          </div>
          <a
            className="service-stage-link"
            href="#contact"
            onClick={() => window.dispatchEvent(new CustomEvent("jrc:servicechange", { detail: service.title }))}
          >
            Let's build this <ArrowIcon diagonal />
          </a>
        </div>
        <div className="service-stage-watermark" aria-hidden="true">{service.number}</div>
      </div>
    </div>
  );
}
