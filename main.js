import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const DATA_FILE = "data.txt";
const PI_SHORT = 3.14;
const DEFAULT_DATA = "1,2,3,4,5,6";
const MIN_SQUARE_VALUE = 2;
const DEFAULT_MODE = "x";
const KNOWN_MODES = ["x", "y", "z"];
const INITIAL_DELAY_MS = 5;
const DEMO_VALUE = 42;
const STEP_DELAYS_MS = [10, 20, 50, 100];

const USERS = [
  { name: "Ivan", age: 30, city: "Kyiv" },
  { name: "Olga", age: 25 },
  { name: "Stepan", age: 41, city: "Lviv" },
];

function sum(numbers) {
  return numbers.reduce((total, value) => total + value, 0);
}

function squareAndFilter(first, second, extra = []) {
  return [...extra, first, second]
    .map((value) => value * value)
    .filter((value) => value > MIN_SQUARE_VALUE);
}

function readDataFile(path) {
  try {
    return readFileSync(path, "utf8");
  } catch (error) {
    console.warn(
      `Не вдалося прочитати "${path}" (${error.code ?? error.message}), використано дані за замовчуванням.`,
    );
    return DEFAULT_DATA;
  }
}

function parseNumbers(text) {
  return text
    .split(",")
    .map((item) => Number.parseInt(item.replace(/\s+/g, ""), 10) || 0);
}

function sortAscending(numbers) {
  return [...numbers].sort((a, b) => a - b);
}

function sortDescending(numbers) {
  return [...numbers].sort((a, b) => b - a);
}

function formatUser({ name = "Anon", age = "??", city = "" } = {}) {
  return `${name} - age:${age} - city:${city}`;
}

function getMode() {
  return typeof location !== "undefined"
    ? location.hash.replace("#", "")
    : DEFAULT_MODE;
}

function buildMessage() {
  const cwd = typeof process !== "undefined" ? process.cwd() : "/";
  const randomValue = Math.random() * 1000;
  return `hello world!!! current time: ${new Date().toString()} -- path: ${cwd} :: ${randomValue}`;
}

function showOnPage(text) {
  if (typeof document === "undefined" || !document.body) {
    return;
  }
  const paragraph = document.createElement("p");
  paragraph.textContent = text;
  document.body.append(paragraph);
}

function weirdMath(value) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new TypeError(`weirdMath приймає лише число, отримано: ${typeof value}`);
  }
  return (
    value +
    Math.floor(Math.random() * 10) -
    Math.sin(Math.PI / 2) +
    Math.cos(PI_SHORT)
  );
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runSteps() {
  for (const [index, ms] of STEP_DELAYS_MS.entries()) {
    await delay(ms);
    console.log(`step${index + 1}`);
  }
}

async function runAsyncDemo() {
  await delay(INITIAL_DELAY_MS);
  console.log("then value", DEMO_VALUE);
  await runSteps();
  console.log("done steps");
}

async function main() {
  console.log("start");
  const message = buildMessage();
  showOnPage(message);
  console.log(message);

  const numbers = parseNumbers(readDataFile(DATA_FILE));
  const total = sum(numbers);
  const squares = [
    squareAndFilter(1, 2),
    squareAndFilter(3, 4),
    squareAndFilter(5, 6),
  ];

  const mode = getMode();
  if (KNOWN_MODES.includes(mode)) {
    console.log("MODE:", mode, "TOTAL =", total, "LEN =", numbers.length);
  } else {
    console.log("UNKNOWN MODE");
  }

  console.log("Final:", {
    total,
    descending: sortDescending(numbers),
    ascending: sortAscending(numbers),
    squares,
    users: USERS.map(formatUser),
  });

  try {
    await runAsyncDemo();
  } catch (error) {
    console.error("Помилка в асинхронній демонстрації:", error);
    throw error;
  }

  console.log("done");
}

const isEntryPoint =
  typeof process !== "undefined" &&
  process.argv[1] === fileURLToPath(import.meta.url);
  if (isEntryPoint) {
    main().catch((error) => {
      console.error(error);
      process.exitCode = 1;
  });
}

export {
  main,
  sum,
  squareAndFilter,
  readDataFile,
  parseNumbers,
  sortAscending,
  sortDescending,
  formatUser,
  weirdMath,
  showOnPage,
};