import React from "react";
import { WhiteBlock } from "../white-block";
import { Input, Textarea } from '../../ui';

interface Props {
  className?: string;
}

export const CheckoutAddresForm: React.FC<Props> = ({
  className,
}) => {
  return (
          <WhiteBlock title="3. Адрес доставки" className={className}>
            <div className="flex flex-col gap-5">
              <Input
                name="addres"
                className="text-base"
                placeholder="Введите адрес..."
              />
              <Textarea
                className="text-base"
                placeholder="Комментарий к заказу"
                rows={5}
              />
            </div>
          </WhiteBlock>
  );
};