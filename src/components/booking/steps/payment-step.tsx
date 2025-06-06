"use client"

import { useState, useEffect } from "react"
import type React from "react"

import { Card, CardContent } from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"
import { CreditCard, Sparkles, ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"
import { skipData } from "../../../constants/booking-data"
import { calculateTotalPrice } from "../../../utils/pricing"
import { StepLayout } from "../step-layout"
import type { BookingState } from "../../../types/booking"
import { PaymentDetailsPopup } from "./payment-details-popup"
import { PaymentCardDisplay } from "./payment-card-display"

const europeanCountries = [
  "United Kingdom",
  "France",
  "Germany",
  "Spain",
  "Italy",
  "Netherlands",
  "Belgium",
  "Switzerland",
  "Austria",
  "Sweden",
  "Norway",
  "Denmark",
  "Finland",
  "Ireland",
  "Portugal",
  "Greece",
  "Poland",
  "Czech Republic",
  "Hungary",
  "Romania",
]

interface PaymentStepProps {
  state: BookingState
  onBack: () => void
  navigationRef: React.RefObject<HTMLDivElement>
}

export function PaymentStep({ state, onBack, navigationRef }: PaymentStepProps) {
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState("United Kingdom")
  const [cardNumber, setCardNumber] = useState("")
  const [cardHolder, setCardHolder] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cardType, setCardType] = useState<"visa" | "mastercard" | "amex" | null>(null)

  const selectedSkipData = skipData.find((skip) => skip.size === state.selectedSkip)
  const totalPrice = selectedSkipData ? calculateTotalPrice(selectedSkipData.price_before_vat, selectedSkipData.vat) : 0

  useEffect(() => {
    // Detect card type based on first digits
    const firstDigit = cardNumber.charAt(0)
    const firstTwoDigits = cardNumber.substring(0, 2)

    if (firstDigit === "4") {
      setCardType("visa")
    } else if (firstTwoDigits >= "51" && firstTwoDigits <= "55") {
      setCardType("mastercard")
    } else if (firstTwoDigits === "34" || firstTwoDigits === "37") {
      setCardType("amex")
    } else {
      setCardType(null)
    }
  }, [cardNumber])

  const handlePaymentClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsPopupOpen(true)
  }

  const handleProceedPayment = (details: { firstName: string; lastName: string; email: string }) => {
   
    console.log("Payment details:", details)
    setIsPopupOpen(false)
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
  }

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "")
    if (value.length <= 16) {
      setCardNumber(value)
    }
  }

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "")
    if (value.length <= 4) {
      const formatted = value.length > 2 ? `${value.slice(0, 2)}/${value.slice(2)}` : value
      setExpiryDate(formatted)
    }
  }

  return (
    <StepLayout currentStep={state.currentStep}>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
            Complete Your Booking
          </h2>
          <p className="text-xl text-slate-600 leading-relaxed">Review your order and complete payment securely</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Order Summary */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <Card className="bg-white shadow-2xl border-slate-200 overflow-hidden">
              <div className="bg-gradient-to-r from-violet-500 to-purple-600 p-6">
                <h3 className="text-2xl font-bold text-white flex items-center">
                  <Sparkles className="w-8 h-8 mr-3" />
                  Order Summary
                </h3>
              </div>
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                    <span className="text-slate-600 font-medium">Skip Size</span>
                    <span className="font-bold text-lg">{state.selectedSkip} Yard Skip</span>
                  </div>

                  <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                    <span className="text-slate-600 font-medium">Hire Period</span>
                    <span className="font-bold text-lg">14 days</span>
                  </div>

                  <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                    <span className="text-slate-600 font-medium">Delivery Address</span>
                    <span className="font-bold text-lg text-right">197 Ashby Road, Hinckley</span>
                  </div>

                  <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                    <span className="text-slate-600 font-medium">Delivery Date</span>
                    <span className="font-bold text-lg">{state.selectedDate?.toLocaleDateString("en-GB")}</span>
                  </div>

                  <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                    <span className="text-slate-600 font-medium">Placement</span>
                    <Badge
                      className={`${
                        state.skipPlacement === "private"
                          ? "bg-green-100 text-green-700 border-green-200"
                          : "bg-blue-100 text-blue-700 border-blue-200"
                      } font-bold`}
                    >
                      {state.skipPlacement === "private" ? "Private Property" : "Public Road"}
                    </Badge>
                  </div>

                  <div className="pt-6 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600 font-medium">Subtotal</span>
                      <span className="font-bold text-lg">£{selectedSkipData?.price_before_vat}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600 font-medium">VAT (20%)</span>
                      <span className="font-bold text-lg">
                        £{selectedSkipData ? Math.round(selectedSkipData.price_before_vat * 0.2) : 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-2xl font-black text-slate-900 pt-4 border-t-2 border-slate-200">
                      <span>Total</span>
                      <span className="text-violet-600">£{totalPrice}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Payment Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="bg-white shadow-2xl border-slate-200 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-6">
                <h3 className="text-2xl font-bold text-white flex items-center">
                  <CreditCard className="w-8 h-8 mr-3" />
                  Payment Details
                </h3>
              </div>
              <CardContent className="p-8">
                <form onSubmit={handleFormSubmit} className="space-y-6">
                  <div className="mb-8">
                    <PaymentCardDisplay
                      cardNumber={cardNumber}
                      cardHolder={cardHolder}
                      expiryDate={expiryDate}
                      cardType={cardType}
                    />
                  </div>

                  <div>
                    <Label htmlFor="country" className="text-slate-700 font-semibold text-lg">
                      Country
                    </Label>
                    <select
                      id="country"
                      value={selectedCountry}
                      onChange={(e) => setSelectedCountry(e.target.value)}
                      className="mt-2 w-full h-12 text-lg border-2 border-slate-200 focus:border-violet-400 focus:ring-violet-400/20 rounded-md px-3"
                    >
                      {europeanCountries.map((country) => (
                        <option key={country} value={country}>
                          {country}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="card-number" className="text-slate-700 font-semibold text-lg">
                      Card Number
                    </Label>
                    <Input
                      id="card-number"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      placeholder="1234 5678 9012 3456"
                      className="mt-2 h-12 text-lg border-2 border-slate-200 focus:border-violet-400 focus:ring-violet-400/20"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="expiry" className="text-slate-700 font-semibold text-lg">
                        Expiry Date
                      </Label>
                      <Input
                        id="expiry"
                        value={expiryDate}
                        onChange={handleExpiryDateChange}
                        placeholder="MM/YY"
                        className="mt-2 h-12 text-lg border-2 border-slate-200 focus:border-violet-400 focus:ring-violet-400/20"
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvv" className="text-slate-700 font-semibold text-lg">
                        CVV
                      </Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        className="mt-2 h-12 text-lg border-2 border-slate-200 focus:border-violet-400 focus:ring-violet-400/20"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="name" className="text-slate-700 font-semibold text-lg">
                      Cardholder Name
                    </Label>
                    <Input
                      id="name"
                      value={cardHolder}
                      onChange={(e: { target: { value: string } }) => setCardHolder(e.target.value.toUpperCase())}
                      placeholder="JOHN SMITH"
                      className="mt-2 h-12 text-lg border-2 border-slate-200 focus:border-violet-400 focus:ring-violet-400/20"
                    />
                  </div>

                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      type="button"
                      onClick={handlePaymentClick}
                      className="w-full bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white text-xl font-bold py-6 shadow-2xl shadow-violet-500/30"
                    >
                      Complete Payment - £{totalPrice}
                    </Button>
                  </motion.div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div ref={navigationRef} className="flex justify-between mt-12">
          <Button
            variant="outline"
            onClick={onBack}
            className="flex items-center bg-white border-slate-300 text-slate-700 hover:bg-slate-50 px-8 py-3"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
        </div>
      </div>

      <PaymentDetailsPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        onProceed={handleProceedPayment}
        totalPrice={totalPrice}
      />
    </StepLayout>
  )
}
