export const displayName = 'IFIC Practice Numericals';

export const IFIC_Practice_Numerical=[
  {
    "id": 1,
    "question": "If a fund reports a compound annual return of 9.25% and a MER of 2.25%, it has a gross return (returns before fees) of approximately:",
    "options": [
      "7.00%",
      "11.50%",
      "9.25%",
      "10.50%"
    ],
    "correct": 1,
    "feedback": "Mutual fund returns are typically reported net of management fees and expenses. To find the gross return (return before fees), you add the Management Expense Ratio (MER) back to the reported compound annual return. Calculation: 9.25% (Net Return) + 2.25% (MER) = 11.50% (Gross Return). Chapter: Chapter 15, Selecting a Mutual Fund."
  },
  {
    "id": 2,
    "question": "If a fund reports a compound annual return of negative -9.25% and a MER of 2.25%, it has a gross return (returns before fees) of approximately:",
    "options": [
      "-7.00%",
      "-11.50%",
      "-9.25%",
      "-10.50%"
    ],
    "correct": 0,
    "feedback": "Similar to Question 1, the reported return of -9.25% is the return after fees. To determine the performance of the underlying assets before fees, you add the MER back to the reported return. Calculation: -9.25% (Net Return) + 2.25% (MER) = -7.00% (Gross Return). Chapter: Chapter 15, Selecting a Mutual Fund."
  },
  {
    "id": 3,
    "question": "Desmond recently purchased shares in the Venus Equity Mutual Fund, an open-end mutual fund. The fund is growing quite rapidly and has a current market value of $110 million on 18 million units outstanding. The company has current assets of $12 million, current liabilities of $4 million and total liabilities of $8 million. What is Venus's net asset value per share (NAVPS)?",
    "options": [
      "$5.44.",
      "$5.67.",
      "$5.89.",
      "$6.11."
    ],
    "correct": 1,
    "feedback": "The Net Asset Value Per Share (NAVPS) is calculated by taking the total assets of the fund, subtracting its total liabilities, and dividing the result by the number of units outstanding. Calculation: ($110,000,000 Total Assets - $8,000,000 Total Liabilities) ÷ 18,000,000 Units = $5.67. Note: 'Current assets' and 'current liabilities' are subsets already included in the 'total assets' and 'total liabilities' figures. Chapter: Chapter 10, The Modern Mutual Fund."
  },
  {
    "id": 4,
    "question": "The NEC equity fund did not perform that well last year, earning a 6% return before management fees. The fund charged management fees of 3.5%. With an inflation rate of 2.5%, this does not represent much of a gain for an equity fund. Which of the following statements is TRUE?",
    "options": [
      "Management fees are deducted before the mutual fund reports its net asset value and rate of return.",
      "The financial press would report a return of 2.5% on this fund.",
      "All mutual funds are required to disclose their management expense ratios.",
      "All of the above."
    ],
    "correct": 3,
    "feedback": "a) is True: Management fees and operating expenses are deducted before a fund reports its NAV and rate of return. b) is True: The reported return is the gross return minus management fees (6.0% - 3.5% = 2.5%). c) is True: National Instrument 81-101 requires funds to disclose their MER in the Fund Facts document. Chapter: Chapters 15 and 16, Selecting a Mutual Fund and Mutual Fund Fees and Services."
  },
  {
    "id": 5,
    "question": "Ted places a redemption order on Tuesday at 7:30 p.m. EST/EDT. The following are the net asset value per unit (NAVPS) figures for the week: Monday $10.23, Tuesday $10.22, Wednesday $10.34, Thursday $10.25, Friday $10.31. What NAVPU will Ted receive?",
    "options": [
      "$10.23",
      "$10.22",
      "$10.34",
      "$10.25"
    ],
    "correct": 2,
    "feedback": "Mutual fund orders are processed based on the next determined NAVPU. Orders submitted after the close of the markets (4 p.m. Eastern Time) are entered at the NAVPU determined on the next business day. Since Ted placed his order on Tuesday at 7:30 p.m., he receives Wednesday's price. Chapter: Chapter 17, Mutual Fund Dealer Regulation."
  },
  {
    "id": 6,
    "question": "At the end of the business day, the Rosewater Canadian Equity Fund collected the following information: Total assets at market value $60,225,374, Long-term liabilities $12,138,336, Units outstanding 7,659,890. What is the net asset value per unit (NAVPU) of the Rosewater Canadian Equity Fund?",
    "options": [
      "$6.28",
      "$7.86",
      "$1.58",
      "Not enough information"
    ],
    "correct": 0,
    "feedback": "The formula for NAVPU is (Total Assets at market value - Total Liabilities) ÷ Units Outstanding. Calculation: ($60,225,374 Assets - $12,138,336 Liabilities) ÷ 7,659,890 Units = $6.28. Chapter: Chapter 10, The Modern Mutual Fund."
  },
  {
    "id": 7,
    "question": "On January 3, Connie Lynne purchases 100 units of Cornerstone Canadian Equity Fund with a net asset value per unit (NAVPU) of $10. Later that year, on December 15, the mutual fund's NAVPU moves to $11, and it makes a distribution of $1 per unit. Connie's distribution is automatically reinvested at a NAVPU of $10. What is the market value of Connie's investment on December 15 after the distribution and reinvestment?",
    "options": [
      "$1,000",
      "$900",
      "$1,500",
      "$1,100"
    ],
    "correct": 3,
    "feedback": "A distribution reinvestment leaves the total portfolio value unchanged from the value just before the distribution occurred. Before the distribution, Connie owned 100 units at $11 each ($1,100). The distribution of $1/unit ($100 total) dropped the NAVPU to $10 ($11 - $1). Reinvesting the $100 at $10/unit gives her 10 new units, for a total of 110 units worth $10 each. Calculation: 110 units × $10 = $1,100. Chapter: Chapter 16, Mutual Fund Fees and Services."
  },
  {
    "id": 8,
    "question": "Pedro owns units of a balanced fund in a non-registered account. He receives a distribution from the mutual fund as follows: $10 of capital gains, $5 of Canadian dividends, $8 of interest income, $2 of foreign income. Which of the following statements regarding his distribution is correct?",
    "options": [
      "50% of interest income and foreign income is taxable.",
      "There is a tax credit available for his Canadian dividend income.",
      "Pedro will pay $10 of taxable capital gains.",
      "foreign income is also eligible for the dividend tax credit."
    ],
    "correct": 1,
    "feedback": "a) is False: Interest and foreign income are 100% taxable at the marginal rate. b) is True: Eligible Canadian dividends receive the federal dividend tax credit (DTC) to avoid double taxation. c) is False: Only 50% of capital gains are taxable ($5 in this case). d) is False: Foreign dividends are generally taxed like interest and do not qualify for the Canadian DTC. Chapter: Chapter 6, Tax and Retirement Planning."
  },
  {
    "id": 9,
    "question": "Phuong has a $1,500 tax refund and would like to invest it in the LACROIX Capital Fund. It currently has a net asset value per unit (NAVPU) of $5.75 and her dealing representative will sell the fund with a front-end sales charge of 1.5%. If she invests today, how many units would she purchase?",
    "options": [
      "260.8696",
      "129.375",
      "264.8422",
      "256.9565"
    ],
    "correct": 3,
    "feedback": "The number of units purchased is the net amount invested divided by the NAVPU. The net amount invested is the total investment minus the sales charge. Calculation: Sales Charge = $1,500 × 1.5% = $22.50. Net Investment = $1,500 - $22.50 = $1,477.50. Units = $1,477.50 ÷ $5.75 = 256.9565. Chapter: Chapter 16, Mutual Fund Fees and Services."
  },
  {
    "id": 10,
    "question": "On August 31, Aishwarya purchases $1,000 of the Conquest European Equity Fund at a net asset value per unit (NAVPU) of $14. On December 15 of the same year, she decides to make another $1,000 purchase at a NAVPU of $12. On December 16, the mutual fund distributes to its unitholders $4 per unit. Aishwarya's distributions are automatically reinvested back into units of the mutual fund. Which of the following statements is CORRECT (please round off to 2 decimal places)?",
    "options": [
      "After the distribution, Aishwarya owns 154.76 units",
      "After the distribution, Aishwarya owns 232.14 units of the mutual fund.",
      "After the distribution, Aishwarya owns 216.67 units",
      "Before the distribution, Aishwarya owns 216.67 units"
    ],
    "correct": 1,
    "feedback": "You must first calculate the units held before the distribution, then the distribution amount, and finally the new units purchased from reinvestment. Calculation: Aug 31 Purchase: $1,000 ÷ $14 = 71.43 units. Dec 15 Purchase: $1,000 ÷ $12 = 83.33 units. Total Units Before Distribution: 71.43 + 83.33 = 154.76 units. Distribution Amount: 154.76 units × $4 = $619.04. NAVPU After Distribution: $12 - $4 = $8. Reinvested Units: $619.04 ÷ $8 = 77.38 units. Total Units After Reinvestment: 154.76 + 77.38 = 232.14 units. Chapter: Chapter 16, Mutual Fund Fees and Services."
  }
]
