import { FlowerApp } from '@/components/flowers/FlowerApp'
import { GitHubStrip } from '@/components/shared/GitHubStrip'

export const revalidate = 86400

export default function FlowersPage() {
  return <FlowerApp strip={<GitHubStrip />} />
}
