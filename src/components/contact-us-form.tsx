import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

export function ContactUsForm() {
  return (
    <div className="min-h-screen flex justify-center items-center md:p-4">
      <div className="bg-white max-w-4xl mx-auto rounded-lg shadow-lg overflow-hidden lg:flex my-3">
        <div className="lg:w-1/2 p-6 sm:p-8 lg:p-12 md:my-auto">
          <div className="md:space-y-11 space-y-3">
            <div className="flex flex-col items-center space-x-2">
              <MapPinIcon className="text-green-500 h-11 w-11" />
              <p className="text-gray-600">123 Lily St. Batasan Hills Q.C</p>
            </div>
            <div className="flex flex-col items-center space-x-2">
              <MailIcon className="text-green-500 h-11 w-11" />
              <p className="text-gray-600">Proxy@gmail.com</p>
            </div>
            <div className="flex flex-col items-center space-x-2">
              <PhoneIcon className="text-green-500 h-11 w-11" />
              <p className="text-gray-600">(219) 555-0114</p>
            </div>
          </div>
        </div>
        <div className="lg:w-1/2 bg-[#F1F5F9] p-6 sm:p-8 lg:p-12">
          <h2 className="text-2xl font-bold text-gray-800">Just Say Hello!</h2>
          <p className="mt-2 text-gray-600">
            Do you fancy saying hi to me or you want to get started with your project and you need my help? Feel free to
            contact me.
          </p>
          <div className="mt-8">
            <Input className="mb-4" id="email" placeholder="zakirsoft@gmail.com" type="email" />
            <Input className="mb-4" id="name" placeholder="Hello!" />
            <Textarea className="mb-4" id="message" placeholder="Subjects" />
            <Button>Send Message</Button>
          </div>
        </div>
      </div>
    </div>
  )
}


function MapPinIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}


function MailIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  )
}


function PhoneIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )
}
