import type { Messages } from "@/lib/i18n/messages"
import type { ProjectKind } from "@/lib/projects/types"

const kindMessage = {
  personal: "kindPersonal",
  college: "kindCollege",
  professional: "kindProfessional",
  other: "kindOther",
} as const satisfies Record<ProjectKind, keyof Messages>

export function kindLabel(kind: ProjectKind, t: Messages) {
  return t[kindMessage[kind]]
}
