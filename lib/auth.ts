"use client"

import { adminUser } from "./data"

export function login(email: string, password: string): boolean {
  return email === adminUser.email && password === adminUser.password
}

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false
  return localStorage.getItem("isAdmin") === "true"
}

export function setAuthenticated(value: boolean): void {
  if (typeof window === "undefined") return
  localStorage.setItem("isAdmin", value.toString())
}

export function logout(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem("isAdmin")
}
