(() => {
    const form = document.querySelector("#contact-form");
    const status = document.querySelector("#form-status");
    const submitButton = form.querySelector('button[type="submit"]');
    const config = window.EMAILJS_CONFIG;
    const hasEmailJsConfig = config
        && config.publicKey
        && config.serviceId
        && config.templateId
        && !Object.values(config).some((value) => value.startsWith("YOUR_"));

    if (hasEmailJsConfig && window.emailjs) {
        window.emailjs.init({ publicKey: config.publicKey });
    }

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        status.textContent = "";
        status.classList.remove("is-error");

        if (!hasEmailJsConfig || !window.emailjs) {
            status.textContent = "No se pudo cargar EmailJS. Recarga la página o inténtalo de nuevo más tarde.";
            status.classList.add("is-error");
            return;
        }

        submitButton.disabled = true;
        submitButton.querySelector("span").textContent = "Enviando...";

        try {
            await window.emailjs.sendForm(config.serviceId, config.templateId, form);
            form.reset();
            status.textContent = "¡Consulta enviada! Gracias por compartir tu proyecto. Me pondré en contacto contigo pronto.";
        } catch (error) {
            console.error("No se pudo enviar el mensaje con EmailJS.", error);
            status.textContent = "No se pudo enviar el mensaje. Inténtalo de nuevo en unos momentos.";
            status.classList.add("is-error");
        } finally {
            submitButton.disabled = false;
            submitButton.querySelector("span").textContent = "Enviar consulta";
        }
    });
})();
