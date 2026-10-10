"use client";

import { useId } from "react";
import { useFormContext } from "react-hook-form";
import { errorProps, Field, Input, NativeSelect } from "@/components/ui/field";
import { INDIAN_STATES, type ShippingAddressInput } from "@/shared/schemas/checkout";

/** Contact and delivery address inputs. Must sit inside a react-hook-form FormProvider. */
export function AddressFields() {
  const id = useId();
  const {
    register,
    formState: { errors },
  } = useFormContext<ShippingAddressInput>();

  const field = (name: keyof ShippingAddressInput) => {
    const fieldId = `${id}-${name}`;
    const error = errors[name]?.message;
    return { fieldId, error, control: { ...errorProps(fieldId, error), ...register(name) } };
  };

  const fullName = field("fullName");
  const email = field("email");
  const phone = field("phone");
  const line1 = field("line1");
  const line2 = field("line2");
  const city = field("city");
  const state = field("state");
  const pincode = field("pincode");

  return (
    <div className="flex flex-col gap-10">
      <fieldset className="m-0 flex flex-col gap-5 border-0 p-0">
        <legend className="mb-5 text-[13px] font-bold tracking-[0.14em] uppercase">Contact</legend>
        <Field label="Full name" htmlFor={fullName.fieldId} error={fullName.error}>
          <Input autoComplete="name" {...fullName.control} />
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="Email"
            htmlFor={email.fieldId}
            error={email.error}
            hint="We'll send your order updates here."
          >
            <Input type="email" autoComplete="email" inputMode="email" {...email.control} />
          </Field>
          <Field
            label="Mobile number"
            htmlFor={phone.fieldId}
            error={phone.error}
            hint="For the delivery partner."
          >
            <Input
              type="tel"
              autoComplete="tel-national"
              inputMode="tel"
              placeholder="98765 43210"
              {...phone.control}
            />
          </Field>
        </div>
      </fieldset>

      <fieldset className="m-0 flex flex-col gap-5 border-0 p-0">
        <legend className="mb-5 text-[13px] font-bold tracking-[0.14em] uppercase">Delivery address</legend>
        <Field label="Address line 1" htmlFor={line1.fieldId} error={line1.error}>
          <Input autoComplete="address-line1" placeholder="House no., building, street" {...line1.control} />
        </Field>
        <Field label="Address line 2 (optional)" htmlFor={line2.fieldId} error={line2.error}>
          <Input autoComplete="address-line2" placeholder="Area, landmark" {...line2.control} />
        </Field>
        <div className="grid gap-5 sm:grid-cols-3">
          <Field label="City" htmlFor={city.fieldId} error={city.error}>
            <Input autoComplete="address-level2" {...city.control} />
          </Field>
          <Field label="State" htmlFor={state.fieldId} error={state.error}>
            <NativeSelect autoComplete="address-level1" defaultValue="" {...state.control}>
              <option value="" disabled>
                Choose
              </option>
              {INDIAN_STATES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </NativeSelect>
          </Field>
          <Field label="PIN code" htmlFor={pincode.fieldId} error={pincode.error}>
            <Input autoComplete="postal-code" inputMode="numeric" maxLength={6} {...pincode.control} />
          </Field>
        </div>
      </fieldset>
    </div>
  );
}
