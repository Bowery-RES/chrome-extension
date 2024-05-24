/* eslint-disable import/prefer-default-export */
import { writable } from 'svelte/store'

export const targetReport = writable({ value: '' })
export const fetchingStatus = writable({ isLoading: false, error: null })
