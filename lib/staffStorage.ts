import type { Staff, StaffInput } from "@/types/staff";

export const STAFF_STORAGE_KEY = "greenvedha_staff_list";

export const DEFAULT_STAFF: Staff[] = [
  {
    id: "staff-anwar",
    fullName: "Anwar Sadath",
    phone: "+971 50 123 4567",
    email: "anwar@greenvedha.com",
    password: "greenvedha",
    salary: 5000,
    joiningDate: "2025-09-01",
    designation: "Manager",
    status: "Active",
  },
  {
    id: "staff-fatima",
    fullName: "Fatima Khan",
    phone: "+971 55 987 6543",
    email: "fatima@greenvedha.com",
    password: "greenvedha",
    salary: 4200,
    joiningDate: "2025-10-15",
    designation: "Sales Executive",
    status: "Active",
  },
  {
    id: "staff-ali",
    fullName: "Ali Raza",
    phone: "+971 56 222 3344",
    email: "ali@greenvedha.com",
    password: "greenvedha",
    salary: 3800,
    joiningDate: "2026-01-12",
    designation: "Staff",
    status: "Active",
  },
  {
    id: "staff-john",
    fullName: "John Mathew",
    phone: "+971 52 778 8899",
    email: "john@greenvedha.com",
    password: "greenvedha",
    salary: 4000,
    joiningDate: "2026-02-20",
    designation: "Sales Executive",
    status: "Inactive",
  },
];

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
  if (!canUseStorage()) return DEFAULT_STAFF;

  try {
    const raw = window.localStorage.getItem(STAFF_STORAGE_KEY);
    if (!raw) {
      writeStaff(DEFAULT_STAFF);
      return DEFAULT_STAFF;
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : DEFAULT_STAFF;
  } catch (error) {
    console.error("Failed to load staff:", error);
    return DEFAULT_STAFF;
  }
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function normalizePhone(phone: string) {
  return phone.replace(/[^\d+]/g, "");
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
