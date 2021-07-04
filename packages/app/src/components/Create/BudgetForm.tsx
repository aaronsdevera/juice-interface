import { Button, Form, FormInstance, Space } from 'antd'
import CurrencySymbol from 'components/shared/CurrencySymbol'
import { FormItems } from 'components/shared/formItems'
import { useAppDispatch } from 'hooks/AppDispatch'
import { useEditingFundingCycleRecurringSelector } from 'hooks/AppSelector'
import { CurrencyOption } from 'models/currency-option'
import { ModRef } from 'models/mods'
import { useLayoutEffect, useState } from 'react'
import { editingProjectActions } from 'redux/slices/editingProject'
import { formattedNum, fromPerbicent, fromWad } from 'utils/formatNumber'

export type BudgetFormFields = {
  duration: string
}

export default function BudgetForm({
  form,
  initialCurrency,
  initialMods,
  initialTarget,
  onSave,
}: {
  form: FormInstance<BudgetFormFields>
  initialCurrency: CurrencyOption
  initialMods: ModRef[]
  initialTarget: number
  onSave: (currency: CurrencyOption, mods: ModRef[], target: number) => void
}) {
  // State objects avoid antd form input dependency rerendering issues
  const [currency, setCurrency] = useState<CurrencyOption>(0)
  const [mods, setMods] = useState<ModRef[]>([])
  const [target, setTarget] = useState<number>(0)
  const isRecurring = useEditingFundingCycleRecurringSelector()
  // TODO budgetForm should not depend on dispatch
  const dispatch = useAppDispatch()

  useLayoutEffect(() => {
    setCurrency(initialCurrency)
    setMods(initialMods)
    setTarget(initialTarget)
  }, [])

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <h1>Funding specs</h1>

      <Form form={form} layout="vertical">
        <FormItems.ProjectDuration
          value={form.getFieldValue('duration')}
          isRecurring={isRecurring}
          onToggleRecurring={() =>
            dispatch(editingProjectActions.setIsRecurring(!isRecurring))
          }
          formItemProps={{
            rules: [{ required: true }],
          }}
        />
        <FormItems.ProjectTarget
          formItemProps={{
            rules: [{ required: true }],
          }}
          value={target.toString()}
          onValueChange={val => setTarget(parseFloat(val || '0'))}
          currency={currency}
          onCurrencyChange={setCurrency}
        />
        <FormItems.ProjectMods
          name="mods"
          mods={mods}
          onModsChanged={setMods}
          addButtonText="Add a payout"
          formatPercent={percent => (
            <span>
              {currency !== undefined ? (
                <CurrencySymbol currency={currency} />
              ) : null}
              {formattedNum(target * (percent / 100), {
                decimals: 0,
                padEnd: 0,
              })}
            </span>
          )}
          formItemProps={{
            label: 'Auto payouts (optional)',
            extra:
              "Commit portions of your project's funding to other Ethereum wallets or Juice projects. Use this to pay contributors, charities, other projects you depend on, or anyone else. Payouts will be distributed automatically anytime a withdrawal is made from your project.",
          }}
        />
        <Form.Item>
          <Button
            style={{ marginTop: 20 }}
            htmlType="submit"
            type="primary"
            onClick={() => onSave(currency, mods, target)}
          >
            Save
          </Button>
        </Form.Item>
      </Form>
    </Space>
  )
}