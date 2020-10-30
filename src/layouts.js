const greeklayout = {
    default: [
      "1 2 3 4 5 6 7 8 9 0 - = {bksp}",
      "; ς ε ρ τ υ θ ι ο π ¨ ΅ \\",
      "{lock} α σ δ φ γ η ξ κ λ ΄ '",
      "{delete} < ζ χ ψ ω β ν μ , . /",
      ".com @ {space}"
    ],
    shift: [
      "~ ! @ # $ % ^ & * ( ) _ + {bksp}",
      ": § Ε Ρ Τ Υ Θ Ι Ο Π ¨ ΅ |",
      '{lock} Α Σ Δ Φ Γ Η Ξ Κ Λ ΄ "',
      "{delete} > Ζ Χ Ψ Ω Β Ν Μ < > ?",
      ".com @ {space}"
    ]
  };

const russianlayout = {
  default: [
    "\u0451 1 2 3 4 5 6 7 8 9 0 - = {bksp}",
    "\u0439 \u0446 \u0443 \u043a \u0435 \u043d \u0433 \u0448 \u0449 \u0437 \u0445 \u044a \\",
    "{lock} \u0444 \u044b \u0432 \u0430 \u043f \u0440 \u043e \u043b \u0434 \u0436 \u044d",
    "{delete} \\ \u044f \u0447 \u0441 \u043c \u0438 \u0442 \u044c \u0431 \u044e /",
    ".com @ {space}"
  ],
  shift: [
    '\u0401 ! " \u2116 ; % : ? * ( ) _ + {bksp}',
    "\u0419 \u0426 \u0423 \u041a \u0415 \u041d \u0413 \u0428 \u0429 \u0417 \u0425 \u042a /",
    "{lock} \u0424 \u042b \u0412 \u0410 \u041f \u0420 \u041e \u041b \u0414 \u0416 \u042d",
    "{delete} / \u042f \u0427 \u0421 \u041c \u0418 \u0422 \u042c \u0411 \u042e /",
    ".com @ {space}"
  ]
};
  

export { greeklayout, russianlayout };