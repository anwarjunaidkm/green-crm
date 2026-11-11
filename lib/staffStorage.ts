import type { Staff, StaffInput } from "@/types/staff";

export const STAFF_STORAGE_KEY = "greenvedha_staff_list";

export const DEFAULT_STAFF: Staff[] = [];

function canUseStorage() {
  return typeof window !== "undefined";
}

function writeStaff(staff: Staff[]) {
  if (canUseStorage()) {
    window.localStorage.setItem(STAFF_STORAGE_KEY, JSON.stringify(staff));
    window.dispatchEvent(new CustomEvent("greenvedha:staff-change"));
  }
}

export function getStoredStaff(): Staff[] {
  if (!canUseStorage()) return [];

  try {
    const raw = window.localStorage.getItem(STAFF_STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Failed to load staff:", error);
    return [];
  }
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function normalizePhone(phone: string) {
  return phone.replace(/\D/g, "");
}

export function findStaffDuplicate(input: StaffInput, exceptId?: string) {
  const email = normalizeEmail(input.email);
  const phone = normalizePhone(input.phone);

  return getStoredStaff().find(
    (staff) =>
      staff.id !== exceptId &&
      (normalizeEmail(staff.email) === email || normalizePhone(staff.phone) === phone),
  );
}

export function createStaff(input: StaffInput): Staff {
  const created: Staff = { ...input, id: `staff-${Date.now()}` };
  writeStaff([created, ...getStoredStaff()]);
  return created;
}

export function updateStaff(id: string, input: StaffInput): Staff {
  const updated: Staff = { ...input, id };
  writeStaff(getStoredStaff().map((staff) => (staff.id === id ? updated : staff)));
  return updated;
}

export function getStaffById(id: string) {
  return getStoredStaff().find((staff) => staff.id === id);
}

export function deleteStaff(id: string) {
  writeStaff(getStoredStaff().filter((staff) => staff.id !== id));
}
