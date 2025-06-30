/**
 * Simple test to verify the testing framework is working
 */
import { describe, test, expect } from 'vitest'

describe('Basic Testing Framework', () => {
  test('should pass a simple test', () => {
    expect(1 + 1).toBe(2)
  })

  test('should handle basic TypeScript compilation', () => {
    const greeting: string = 'Hello, Testing!'
    expect(greeting).toBe('Hello, Testing!')
  })

  test('should work with async functions', async () => {
    const result = await Promise.resolve('success')
    expect(result).toBe('success')
  })
})