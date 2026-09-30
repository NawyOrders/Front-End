"use client";

import { Children, Fragment, isValidElement, memo, type ReactNode } from "react";
import { stagger } from "@/lib/motion/hooks";
import { splitWords } from "@/lib/motion/runtime";

/**
 * Splits a headline into words and hands each one its own entrance.
 *
 * Existing markup is kept exactly as written — the caller still passes the same
 * strings and the same `<span className="text-brand">` around the highlighted
 * words. This component only walks that children list:
 *
 *   • every word becomes `.reveal.rv-blur` with its own `--i` stagger step;
 *   • every word inside a `.text-brand` element becomes `.rv-zoom-out`
 *     instead, and gets `.u-draw` so an underline sweeps out from the
 *     reading-start edge under those words only.
 *
 * Arabic is cursive, so this splits by WORD only. Splitting by letter would
 * break the joins between characters. Spaces are emitted as plain text nodes
 * between the words, so line breaking and shaping behave exactly as before.
 *
 * One observer entry reveals the whole headline: the wrapper carries
 * `data-reveal` and `.is-cascade` hands the end state to every word.
 */

type Counter = { i: number };

/** The highlighted words are already marked `.text-brand` by the caller. */
const isAccent = (node: ReactNode): boolean =>
  isValidElement<{ className?: string }>(node) &&
  typeof node.props.className === "string" &&
  node.props.className.includes("text-brand");

const renderWords = (text: string, accent: boolean, counter: Counter, key: string): ReactNode[] => {
  const words = splitWords(text);
  const nodes: ReactNode[] = [];

  // Whitespace either side of the source string is preserved so two parts that
  // were separated by a space in JSX stay separated.
  const lead = /^\s/u.test(text) ? " " : null;
  const trail = /\s$/u.test(text) ? " " : null;
  if (lead) nodes.push(lead);

  words.forEach((word, index) => {
    if (index > 0) nodes.push(" ");
    nodes.push(
      <span
        key={`${key}-${index}`}
        className={accent ? "wd reveal rv-zoom-out u-draw" : "wd reveal rv-blur"}
        style={stagger(counter.i)}
      >
        {word}
      </span>,
    );
    counter.i += 1;
  });

  if (trail) nodes.push(trail);
  return nodes;
};

const renderNodes = (nodes: ReactNode, accent: boolean, counter: Counter): ReactNode[] =>
  Children.toArray(nodes).map((node, index) => {
    if (typeof node === "string" || typeof node === "number") {
      return <Fragment key={`s-${index}`}>{renderWords(String(node), accent, counter, `s${index}`)}</Fragment>;
    }
    if (isValidElement<{ className?: string; children?: ReactNode }>(node)) {
      // The caller's own classes are passed through untouched: the wrapper keeps
      // `.text-brand`, and only the words inside it get the sweep, so one
      // headline draws one underline instead of one per word and one per wrapper.
      const highlighted = accent || isAccent(node);
      const { className, children } = node.props;
      return (
        <span key={String(node.key ?? `e-${index}`)} className={className}>
          {renderNodes(children, highlighted, counter)}
        </span>
      );
    }
    return null;
  });

export const HeadlineWords = memo(function HeadlineWords({ children }: { children: ReactNode }) {
  return <span data-reveal className="is-cascade">{renderNodes(children, false, { i: 0 })}</span>;
});