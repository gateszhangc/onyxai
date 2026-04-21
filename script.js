const waitlistForm = document.querySelector("[data-waitlist-form]");
const revealNodes = document.querySelectorAll("[data-reveal]");

const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const setFormState = (state, message) => {
  if (!waitlistForm) {
    return;
  }

  const messageNode = waitlistForm.querySelector("[data-form-message]");
  waitlistForm.dataset.state = state;
  messageNode.textContent = message;
};

if (waitlistForm) {
  const emailInput = waitlistForm.querySelector('input[name="email"]');

  waitlistForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const email = emailInput.value.trim();

    if (!email) {
      setFormState("error", "Enter an email to preview the waitlist flow.");
      emailInput.focus();
      return;
    }

    if (!isValidEmail(email)) {
      setFormState("error", "Use a valid email address.");
      emailInput.focus();
      return;
    }

    setFormState(
      "success",
      "Waitlist opening soon. This demo page does not store your address yet."
    );
    waitlistForm.reset();
  });

  emailInput.addEventListener("input", () => {
    if (waitlistForm.dataset.state === "error") {
      setFormState("idle", "No address is stored from this page yet.");
    }
  });
}

for (const node of revealNodes) {
  node.classList.add("is-visible");
}
