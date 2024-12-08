import { Input } from "@/components/ui/input"

export default function SidePanelContent() {
  return (
    <div className='h-full flex flex-col justify-between'>
        <div>SidePanelContent</div>
        <Input placeholder="Send a messages to everyone" />
    </div>
  )
}
