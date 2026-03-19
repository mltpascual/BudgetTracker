/**
 * Redirect to Landing page — kept for compatibility.
 */
import { Redirect } from "wouter";

export default function Home() {
  return <Redirect to="/" />;
}
