const globalSetProperty = (query, property, value) =>
  document.querySelectorAll(query).forEach(v => {
    v.style.setProperty(property, value);
  });

const ROTATIONS = {
  1: "0deg",
  2: "-50deg",
  3: "-69deg",
  4: "-83deg",
  5: "-95deg",
  6: "-109deg",
  7: "-125deg",
  8: "50deg",
  9: "69deg",
  10: "83deg",
  11: "95deg",
  12: "109deg",
  13: "125deg",
}

const DURATIONS = {
  1: 60,
  2: 45,
  3: 2,
  4: 145,
  5: 258,
  6: 25,
  7: 125,
  8: 98,
  9: 36,
  10: 78,
  11: 64,
  12: 654,
  13: 15,
}

let CURRENT_PROGRAM = 1;
let REMAINING_TIME = DURATIONS[CURRENT_PROGRAM];
// 0: Waiting, 1: Working, 2: Spinning
let CURRENT_STATE = undefined;

let DETERGENTE_AMOUNT = .2;
let SUAVIZANTE_AMOUNT = .2;

const getValueOnOptionSelected = (e) => {
  let value;
  try {
    value = e.target.attributes.value.value;
  } catch (error) {
    value = e.target.parentElement.attributes.value.value;
  }
  return value;
}

const setDetergente = (v) => {
  DETERGENTE_AMOUNT = v;
  globalSetProperty(".cargador.detergente", "--fill-pt", `${v * 100}%`)
}

const setSuavizante = (v) => {
  SUAVIZANTE_AMOUNT = v;
  globalSetProperty(".cargador.suavizante", "--fill-pt", `${v * 100}%`)
}

const enoughtResources = () => DETERGENTE_AMOUNT >= .2 && SUAVIZANTE_AMOUNT >= .2;

const useResources = () => {
  setDetergente(DETERGENTE_AMOUNT - .2);
  setSuavizante(SUAVIZANTE_AMOUNT - .2);
}

const zeroPad = (n) => {
  if (n < 10) return '0' + String(n)
  else return String(n)
}

const switchDial = (v) => {
  globalSetProperty(".dial", "--rotation", ROTATIONS[v]);
}

const switchTimeDisplay = (time) => {
  document.querySelectorAll(".tiempo-container>span").forEach(e => {
    e.innerText = `${zeroPad(Math.floor(time / 60))}:${zeroPad(time % 60)}`
  })
}

const setStatus = (i) => {
  CURRENT_STATE = i;
  document.querySelectorAll(".fase-container").forEach((e) => {
    for (const item of e.children) item.classList.remove("active");
    e.children[i].classList.add("active");
  });
};

const onOptionSelected = (e) => {
  const value = getValueOnOptionSelected(e);
  CURRENT_PROGRAM = value;
  switchDial(CURRENT_PROGRAM);
  if (CURRENT_STATE != 0) return;
  const time = DURATIONS[CURRENT_PROGRAM];
  REMAINING_TIME = time;
  switchTimeDisplay(REMAINING_TIME);
}

const onStartSelected = (e) => {
  if (CURRENT_STATE != 0) {
    alert("Espera a que acabe la lavadora bro");
    return;
  }
  if (!enoughtResources()) {
    alert("Lo mismo te falta suavizante o detergente, échale");
    return;
  }
  console.log("Iniciando lavadora");
  if (CURRENT_PROGRAM == 13) {
    setStatus(2);
    document.querySelector(".ventana")
      .classList
      .add("spinning")
  } else {
    useResources();
    setStatus(1);
    document.querySelector(".ventana")
      .classList
      .add("lavando")
  }

  const interval = setInterval(() => {
    if (REMAINING_TIME == 0) {
      clearInterval(interval);
      setStatus(0);
      document.querySelector(".ventana")
        .classList
        .remove("spinning", "lavando")
      return;
    }
    REMAINING_TIME--;
    switchTimeDisplay(REMAINING_TIME);
  }, 1000);
}

const onSpinSelected = () => {
  if (CURRENT_STATE != 0) {
    alert("Espera a que acabe la lavadora bro");
    return;
  }
  CURRENT_PROGRAM = 13;
  REMAINING_TIME = DURATIONS[CURRENT_PROGRAM];
  switchTimeDisplay(REMAINING_TIME);
  onStartSelected();
}

const onDetergenteSelected = () =>
  setDetergente(Math.min(1, DETERGENTE_AMOUNT + .2));

const onSuavizanteSelected = () =>
  setSuavizante(Math.min(1, SUAVIZANTE_AMOUNT + .2));

document.addEventListener("DOMContentLoaded", (e) => {
  document.querySelectorAll(".option").forEach(e => {
    e.addEventListener("click", onOptionSelected);
  })
  document.querySelectorAll(".boton.start").forEach((e) => {
    e.addEventListener("click", onStartSelected)
  })
  document.querySelectorAll(".boton.spin").forEach((e) => {
    e.addEventListener("click", onSpinSelected)
  })
  document.querySelectorAll(".cargador.detergente").forEach((e) => {
    e.addEventListener("click", onDetergenteSelected)
  })
  document.querySelectorAll(".cargador.suavizante").forEach((e) => {
    e.addEventListener("click", onSuavizanteSelected)
  })
  switchDial(CURRENT_PROGRAM);
  switchTimeDisplay(REMAINING_TIME);
  setStatus(0);
  setDetergente(.2);
  setSuavizante(.6);
})