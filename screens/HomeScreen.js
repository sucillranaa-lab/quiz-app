import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator, SafeAreaView } from '../components/ui';
import { BarChart3, CheckCircle2, ClipboardList, Plus, Sparkles } from 'lucide-react-native';
import { getAllQuizzes, getQuestionsByQuizId, getProgressByQuizId, clearProgress, addQuiz, addQuestions, initDB } from '../db/database';
import QuizCard from '../components/QuizCard';
import { getAnsweredCount } from '../utils/helpers';

// IFIC Quiz 1 Data
const ificQuiz1 = {
  title: 'IFIC Practice Test 1',
  questions: [
    { questionText: "What is the purpose of the fund facts?", options: ["To determine if a fiduciary duty is present in the representative-client relationship.", "To clarify for clients the nature and terms of their relationship with the dealer of the fund.", "To better align the interests of the fund with the client.", "To provide clients with key fund information that is relevant to their investment decisions."], correctIndex: 3, feedback: "The fund facts document is a four-page document designed to give investors key information that is relevant to their investment decision." },
    { questionText: "What term describes the range of possible future outcomes on the price of a security?", options: ["Fluctuation.", "Return.", "Risk.", "Beta."], correctIndex: 2, feedback: "Risk is the potential volatility in returns or the range of possible future outcomes on the price of a security." },
    { questionText: "A client has $100,000 in a savings account, $5,000 in a chequing account, and $10,000 in loans. Calculate his net worth.", options: ["$115,000", "$90,000", "$105,000", "$95,000"], correctIndex: 3, feedback: "Net worth is $105,000 - $10,000 = $95,000." },
    { questionText: "Which newspaper article would be likely to result in foreign capital moving out of a country?", options: ["International Ranking of Domestic Level of Education Rises Significantly.", "New Taxes on Foreign Direct Investment.", "Government Re-elected for a Fourth Consecutive Term.", "Corporate Taxes Reduced."], correctIndex: 1, feedback: "Increased trade barriers or increased taxes on foreign investments would typically reduce the attractiveness of a country for foreign investment." },
    { questionText: "Which example demonstrates direct use of capital savings?", options: ["Depositing funds in a Canadian bank account.", "Building a new factory.", "Purchasing an investment fund.", "Purchasing a company's stocks."], correctIndex: 1, feedback: "Capital savings are used directly by, for example, a couple investing their savings in a home; a government investing in a new highway or hospital." },
    { questionText: "Which of the following transactions takes place in the secondary market?", options: ["Issue of new debt and equity securities.", "Issue of federal Treasury bills.", "Sale of mutual funds.", "Resale of previously issued securities."], correctIndex: 3, feedback: "The secondary market involves the resale of previously issued securities between investors." },
    { questionText: "Which exchange in Canada deals exclusively with financial and equity futures and options?", options: ["The Montreal Exchange.", "The Toronto Stock Exchange.", "Canadian Securities Exchange.", "The TSX Venture Exchange."], correctIndex: 0, feedback: "The Montreal Exchange is the only exchange in Canada that deals exclusively with financial and equity futures and options." },
    { questionText: "What term applies to unemployment created by a new technology that eliminates the need for subway train drivers?", options: ["Structural.", "Frictional.", "Cyclical.", "Natural."], correctIndex: 0, feedback: "Structural unemployment results from changes in the economy, such as technological advances." },
    { questionText: "The demand for blue widgets increases sharply... What can be said about the law of supply?", options: ["Price and production both decreases.", "Price increases and production decreases.", "Price decreases and production increases.", "Price and production both increases."], correctIndex: 3, feedback: "When demand is greater than supply, the price increases, and producers increase production." },
    { questionText: "If the Consumer Price Index (CPI) was 140.6 last year and 146.9 this year, what was the inflation rate?", options: ["5.20%", "6.04%", "4.48%", "4.12%"], correctIndex: 2, feedback: "(146.9 - 140.6) / 140.6 × 100 = 4.48%" },
    { questionText: "Gary chooses not to recommend that his client sell a current mutual fund... What responsibility applies?", options: ["Legal.", "Compliance.", "Ethical.", "Professional."], correctIndex: 2, feedback: "Gary is fulfilling his ethical responsibility." },
    { questionText: "What does suitability mean?", options: ["Recommendations are not based on the personal...","The investor's major concerns are addressed.","Understanding the personal...","Recommendations are appropriate for the client's unique situation..."], correctIndex: 3, feedback: "Suitability means ensuring that all recommendations are appropriate for the client's unique situation..." },
    { questionText: "Which organization regulates mutual and investment funds?", options: ["Investment Industry Regulatory Organization of Canada.", "Bourse de Montreal.", "Mutual Fund Dealers Association.", "Securities commissions."], correctIndex: 3, feedback: "The responsibility of regulating mutual funds lies with the securities commissions." },
    { questionText: "What stage in the business cycle typically has increasing wages, rising inflation, rising interest rates with slowing sales, and decreasing business investment?", options: ["Recovery.", "Expansion.", "Peak.", "Trough."], correctIndex: 2, feedback: "The top of the cycle is called a peak. A peak is characterized by increasing wages, rising inflation, rising interest rates, slowing sales, and decreasing business investment." },
    { questionText: "Based on the financial planning pyramid, what security would be appropriate for a very aggressive investor?", options: ["Tax shelters.", "Over the Counter (OTC) Securities.", "Commodities.", "Foreign stocks."], correctIndex: 1, feedback: "A very aggressive investor could consider investments such as OTC Securities." },
    { questionText: "Your client earns $100,000 from employment and $10,000 from investments each year. Her bills total $95,000 annually. What is her discretionary income?", options: ["$15,000", "$10,000", "$20,000", "$5,000"], correctIndex: 0, feedback: "Discretionary income eligible for savings and investments is $100,000 + $10,000 - $95,000 = $15,000." },
    { questionText: "What bias results in investors valuing an asset that they own over an asset that another individual owns?", options: ["Representativeness.", "Risk aversion.", "Endowment.", "Status Quo."], correctIndex: 2, feedback: "People who are subject to endowment bias place more value on an asset they hold property rights to than on an asset they do not hold." },
    { questionText: "What response would a loss-averse investor be most likely to choose in selecting a preferred investment return scenario?", options: ["A 75% chance of losing $1,000, and a 25% chance of losing nothing.", "A 25% chance of gaining $2,000, and a 75% chance of losing nothing.", "An assured loss of $750.", "A 5% chance of gaining $1,500, and a 95% chance of losing $800."], correctIndex: 1, feedback: "The loss-averse investor will choose a lower potential of loss over a more rational choice." },
    { questionText: "What bias would influence an investor's decision to continue to hold an unprofitable investment despite little likelihood of an improvement?", options: ["Availability.", "Status quo.", "Representativeness.", "Loss aversion."], correctIndex: 3, feedback: "Loss aversion bias states that people generally feel a stronger impulse to avoid losses than to acquire gains." },
    { questionText: "Joanne's income last year was $45,000 and her pension adjustment was $2,500. She has $2,000 in the carry forward RRSP room. What is Joanne's maximum tax-deductible RRSP contribution amount?", options: ["$12,600", "$7,600", "$8,100", "$5,600"], correctIndex: 1, feedback: "Joanne's tax-deductible RRSP contribution room would be calculated as (18% × $45,000) - $2,500 + $2,000 = $7,600." },
    { questionText: "Rebecca, an investor in a 40% marginal tax bracket, receives $1,200 in Canadian dividends eligible for the dividend tax credit. What is the dividend tax credit?", options: ["$1,200", "$480", "$248.73", "$662.40"], correctIndex: 2, feedback: "The taxable amount is $1,200 + ($1,200 × 38%) = $1,656. Dividend tax credit is 15.02% of $1,656 ≈ $248.73." },
    { questionText: "Which form of investment income is taxed at an investor's marginal tax rate?", options: ["Capital losses.", "Canadian dividend income.", "Foreign dividend income.", "Capital gains."], correctIndex: 2, feedback: "Foreign dividend income is not eligible for any dividend tax credit and is taxed at an investor's marginal tax rate." },
    { questionText: "What type of benefit plan has a final benefit that is dependent on the investment returns within the plan?", options: ["Career average plan.", "Flat benefit plan.", "Final average plan.", "Defined contribution plan."], correctIndex: 3, feedback: "In a defined contribution plan, the eventual benefits at retirement will be based on how the contributions were invested within the plan." },
    { questionText: "What is the step in the financial planning process that includes a discussion of a client's household budget?", options: ["Develop a written financial plan.", "Interview the client.", "Identify financial situation and constraints.", "Gather data and identify goals and objectives."], correctIndex: 2, feedback: "The household budget is part of the discussions related to identifying financial problems and constraints." },
    { questionText: "What is the characteristic of a Stage 2 – Family Commitment investor that most affects the ability to save for the long term?", options: ["Wealth transfer considerations.", "Lack of liquidity.", "Marginal tax bracket.", "Risk tolerance."], correctIndex: 1, feedback: "In Stage 2, the lack of liquidity that is typical results in a difficulty in allocating funds to savings." },
    { questionText: "Ian is 25, employed, and has no dependents. What asset allocation would typically suit him?", options: ["50% in equity funds, 20% in a bond fund and 30% in a money market fund.", "10% in a bond fund, 80% in equity funds, 10% in a money market fund.", "35% in equity, 25% in a money market fund, 60% in a bond fund.", "10% in equity funds, 70% in a bond fund, 20% in a money market fund."], correctIndex: 1, feedback: "Stage 1 – Early Earning Years investor with high risk tolerance: 10% bond, 80% equity, 10% money market." },
    { questionText: "Your client wants to purchase a mutual fund based on a 'hot tip' from a friend. What bias is he most likely affected by?", options: ["Endowment.", "Hindsight.", "Availability.", "Overconfidence."], correctIndex: 3, feedback: "Overconfidence is defined generally as unwarranted faith in one's intuitive reasoning, judgements and cognitive abilities." },
    { questionText: "Jeff shows strong emotional biases. What should the advisor do?", options: ["The advisor should adapt to Jeff's cognitive biases.", "The advisor should moderate and adapt to Jeff's emotional biases.", "The advisor should moderate Jeff's emotional biases.", "The advisor should moderate and adapt to Jeff's cognitive biases."], correctIndex: 1, feedback: "Jeff has a relatively low level of wealth and strong emotional biases; the advisor should moderate and adapt to Jeff's emotional biases." },
    { questionText: "How is a $10,000 withdrawal from a registered retirement savings plan (RRSP) taxed?", options: ["As regular income.", "As a deduction against other income.", "Based on the type of investment income type.", "At a set rate of 30%."], correctIndex: 0, feedback: "Contributions withdrawn from an RRSP are taxed as regular income at the plan holder's marginal tax rate." },
    { questionText: "What portion of the withdrawal from a Registered Educational Savings Plan (RESP) is tax-free?", options: ["Capital gains earned.", "Canadian Educational Savings Grant (CESG) amounts.", "Dividend income earned.", "Original capital contributed."], correctIndex: 3, feedback: "The original capital withdrawn from an RESP is not taxed; all other amounts are taxed in the hands of the beneficiary." },
    { questionText: "An employer wants a simple-to-understand pension plan that rewards participants based on years of service. Which plan?", options: ["Career average plan.", "Final average plan.", "Defined contribution plan.", "Flat benefit plan."], correctIndex: 3, feedback: "The flat benefit plan is simple to understand and provides a retirement income based solely on years of service." },
    { questionText: "A high-income client wants to minimize tax on investment income. Which mutual fund is best?", options: ["Money market fund.", "Foreign equity fund.", "Fixed-income fund.", "Canadian equity fund."], correctIndex: 3, feedback: "Canadian equity fund is the most tax-effective as it generates dividends and capital gains." },
    { questionText: "Your client has $46,000 unused RRSP contribution room and contributes $15,000 this year. How much can he carry forward?", options: ["$31,000", "$46,000", "$35,000", "$38,000"], correctIndex: 0, feedback: "Any unused RRSP contribution room can be carried forward indefinitely. $46,000 - $15,000 = $31,000." },
    { questionText: "What is a key difference between marketable government bonds and treasury bills?", options: ["Marketable government bonds may be sold at a discount while treasury bills are sold at a premium.", "Treasury bills trade in the over-the-counter market.", "Marketable government bonds actively trade in the secondary market.", "Treasury bills do not pay any coupon interest, while marketable bonds do."], correctIndex: 3, feedback: "Treasury bills do not pay any coupon interest; they are sold at a discount." },
    { questionText: "Which security is most likely to provide a capital gain if held to maturity?", options: ["Cumulative preferred shares bought at par value.", "A corporate bond bought at a discount.", "Common shares of a mature company.", "A government bond bought at a premium."], correctIndex: 1, feedback: "A bond bought at a discount will provide a capital gain when it matures at par." },
    { questionText: "An investor earned a 2% return before inflation adjustment while inflation was 1.5%. What was his nominal rate of return?", options: ["1.50%", "2.00%", "3.50%", "0.50%"], correctIndex: 1, feedback: "Nominal return is the return before adjustment for inflation (2.00%)." },
    { questionText: "Fund A has a 5-year average return of 10% and a standard deviation of 5%. Fund B has a 5-year average return of 8% and a standard deviation of 2%. Select the most accurate statement.", options: ["Fund B is less risky than Fund A.", "Fund A's returns have ranged from 5% to 10%.", "Fund A will always provide a higher return than Fund B.", "Fund B's lowest return is lower than Fund A's lowest return."], correctIndex: 0, feedback: "Fund B is less risky than Fund A because it has a lower standard deviation." },
    { questionText: "Calculate the 2-year simple return for the AAA Mutual Fund.", options: ["8%", "7%", "-3%", "3%"], correctIndex: 1, feedback: "Return = ($10.20 + $0.50 - $10.00) / $10.00 = 7.00% (cumulative over 2 years)." },
    { questionText: "Which statement best describes what a rational investor will do when comparing the risk and return of two investments?", options: ["He will select the one that minimizes risk and maximizes return.", "He will select the one that maximizes risk and maximizes return.", "He will select the one with the higher expected risk because that is the only way to earn a higher return.", "He will select the one with the lower risk because all investors are risk averse."], correctIndex: 0, feedback: "A rational investor will select the investment that offers the highest return for a given level of risk or the lowest risk for a given level of return." },
    { questionText: "Why do speculators tend to avoid diversification?", options: ["Diversifying a portfolio tends to increase the probability of very large gains and losses.", "Diversifying a portfolio tends to reduce the probability of very large gains and losses.", "Diversifying a portfolio may result in an overall risk that is lower than that of its component securities.", "Not diversifying a portfolio exposes the investor to the total risk of the securities."], correctIndex: 1, feedback: "Diversification tends to reduce the probability of both very large losses and very large gains. Speculators tend to avoid diversification." },
    { questionText: "What items are typically classified as current assets on the statement of financial position?", options: ["Cash, inventories, and depreciation.", "Cash, accounts receivable, and inventories.", "Cash, accrued charges, and accounts receivable.", "Cash, accounts receivable, and retained earnings."], correctIndex: 1, feedback: "Typical current asset accounts include cash, inventories, and accounts receivable." },
    { questionText: "Ally wishes to buy a preferred share where any regular dividend payment that the board skips will collect in arrears. What preferred share feature should Ally be seeking?", options: ["Voting.", "Callable.", "Soft retraction.", "Cumulative."], correctIndex: 3, feedback: "Cumulative preferred shares accumulate unpaid dividends in arrears." },
    { questionText: "Which statement best describes one of the main differences between short and long transactions?", options: ["In a long transaction, the investor must pay the broker the cost of repurchasing the shares.", "Short transactions are more common than long transactions.", "Short sales must result in a decline in the price of the stock that is sold short.", "Investors using long transactions anticipate a price increase in the security."], correctIndex: 3, feedback: "Investors who anticipate a price increase use long transactions." },
    { questionText: "Sonya is concerned about a market pullback. Which strategy is most appropriate?", options: ["Buy put options on the iShares S&P/TSX 60 Index Fund.", "Buy call options on the iShares S&P/TSX 60 Index Fund.", "Increase her equity exposure to the consumer staples sector.", "Reduce her equity exposure to the energy sector."], correctIndex: 0, feedback: "Buying put options protects against a decline in the market." },
    { questionText: "Which statement about market risk is true?", options: ["Market risk is greater than the sum of the risks of all stocks.", "Market risk is cancelled out by diversification.", "Market risk can result from changes in inflation and interest rates.", "Market risk is measured by standard deviation."], correctIndex: 2, feedback: "Market risk (systematic risk) arises from inflation, business cycle, and interest rates." },
    { questionText: "The Optima Equity Fund has a beta of 1.4. What is the most accurate description?", options: ["If the market goes down by 5%, the Optima Fund should go down by 5.7%.", "If the market goes up by 5%, the Optima fund should go up by 7%.", "If the market goes down by 10%, the Optima fund should go up by 11.4%.", "If the market goes up by 10%, the Optima Fund should go up by 14%."], correctIndex: 3, feedback: "Beta of 1.4 means the fund is expected to move 1.4 times the market." },
    { questionText: "A portfolio manager first analyzes a variety of asset mixes to determine an optimal portfolio and then adjusts by monitoring and rebalancing. What is this process called?", options: ["Strategic asset allocation.", "Sector weighting.", "Market timing.", "Passive management."], correctIndex: 0, feedback: "This is called Strategic Asset Allocation." },
    { questionText: "Rank the decisions made by a portfolio manager in order of importance.", options: ["Security selection, sector weighting, asset allocation.", "Asset allocation, sector weighting, security selection.", "Sector weighting, security selection, asset allocation.", "Asset allocation, security selection, sector weighting."], correctIndex: 1, feedback: "Asset allocation > Sector weighting > Security selection (Modern Portfolio Theory)." },
    { questionText: "Which of the following asset allocation statements is correct?", options: ["You should review a client's asset allocation when the investment environment changes.", "A fixed income component of less than 25% is appropriate for conservative portfolios.", "Portfolio security selection determines the long-term growth potential.", "Equity weightings greater than 90% should not be recommended."], correctIndex: 0, feedback: "Asset allocation should be reviewed when the investment environment changes." },
    { questionText: "Which financial leverage ratio measures a company's ability to repay its borrowings?", options: ["Total debt ratio", "Operating profit margin ratio.", "Cash flow from operations to total debt ratio.", "Interest coverage ratio."], correctIndex: 2, feedback: "The cash flow from operations/total debt ratio gauges a company's ability to repay its borrowings." },
    { questionText: "What is Widget Inc.'s gross profit?", options: ["$75,000", "$45,000", "$50,000", "$120,000"], correctIndex: 3, feedback: "Gross profit = Sales - Cost of Goods Sold = $200,000 - $80,000 = $120,000." },
    { questionText: "Apex Mutual Fund has been structured to avoid taxation by distributing any net interest, dividends, and capital gains to unitholders each calendar year. This is an example of what type of mutual fund structure?", options: ["Open-ended mutual fund.", "Mutual fund trust.", "Closed-end mutual fund.", "Mutual fund corporation."], correctIndex: 1, feedback: "The most common structure for mutual funds in Canada is the open-end trust." },
    { questionText: "What criteria does the independent review committee use to determine if a potential conflict of interest should be approved?", options: ["Will the action contravene National Instrument 81-102?", "Will the action contravene a unitholder's statutory rights?", "Will the action require unitholder approval?", "Will the action achieve a fair and reasonable result for the fund?"], correctIndex: 3, feedback: "The IRC will only approve actions where a conflict of interest arises if the action achieves a fair and reasonable result for the fund." },
    { questionText: "Why is it important that an investor receives a copy of the Fund Facts document prior to buying a mutual fund?", options: ["The investor can verify that the fund has not misstated any material facts.", "The investor can verify that the fund manager is adhering to the fund's stated investment objectives.", "The investor can verify that his statutory rights have been respected.", "The investor can verify that the fund's stated investment objectives and risk profile match his own."], correctIndex: 3, feedback: "The fundamental purpose of a Fund Facts document is to provide full, plain and true disclosure so investors can make informed decisions." },
    { questionText: "What entity receives all fund money obtained from investors buying units/shares?", options: ["Dealer.", "Custodian.", "Registrar.", "Fund manager."], correctIndex: 1, feedback: "The Custodian holds all the fund's assets." },
    { questionText: "The ZZZ Money Market Fund has a 7-day yield of 0.05%. What is the current yield for the fund?", options: ["2.22%", "2.61%", "1.61%", "0.05%"], correctIndex: 1, feedback: "Current yield = (Seven-day yield × 365 / 7) = 2.61%." },
    { questionText: "Which type of fund is least likely to produce capital gains income?", options: ["Money market fund.", "Preferred dividend fund.", "Short-term bond fund.", "Mortgage fund."], correctIndex: 0, feedback: "Money market funds produce only interest income. No capital gains are possible because unit value remains constant at $10." },
    { questionText: "What type of risk is the fundamental risk factor for fixed-income securities?", options: ["Reinvestment risk.", "Liquidity risk.", "Interest rate risk.", "Market risk."], correctIndex: 2, feedback: "Interest rate risk is the fundamental risk factor for fixed-income securities." },
    { questionText: "Which statement is most accurate about fund wraps?", options: ["The investor pays fees to both the wrap manager and the manager of the underlying funds.", "The fund wrap sponsor is responsible for asset allocation decisions.", "Each model is designed to meet the needs of the individual.", "There is essentially no regulatory difference between a fund wrap and a standard mutual fund."], correctIndex: 1, feedback: "The fund wrap sponsor is responsible for asset allocation decisions." },
    { questionText: "Your client would like to invest in a global equity fund. What should you advise her about foreign currency risk?", options: ["The value of the fund will go up if the Canadian dollar increases in value against the foreign currency.", "The fund manager can hedge the exchange risk by buying foreign currency through futures contracts.", "The foreign exchange risk will be offset by the lower liquidity risk.", "The fund may provide a hedge against a decline in the Canadian dollar."], correctIndex: 3, feedback: "A global equity fund may provide a hedge against a decline in the Canadian dollar." },
    { questionText: "Which type of fixed income fund has a short duration, with the objectives of preserving capital and generating better current income than a money market fund?", options: ["Short-term bond fund.", "Mortgage fund.", "T-bill fund.", "Preferred dividend fund."], correctIndex: 0, feedback: "Short-term bond funds have short duration and aim to generate better income than money market funds." },
    { questionText: "What best describes why mortgage funds generally have less sensitivity to changes in interest rates than bond funds?", options: ["Many mortgage funds also hold T-bills and mortgage-backed securities.", "Most mortgages held in mortgage funds are either NHA-insured or privately insured.", "Interest on mortgages is usually paid monthly, while interest on bonds is typically paid semiannually.", "Mortgage funds are highly diversified, often holding over 10,000 individual mortgages."], correctIndex: 2, feedback: "Interest on mortgages is paid monthly while bonds pay semiannually." },
    { questionText: "Recently interest rates have gone up. How will this affect the value of a mortgage fund?", options: ["The value of the mortgage fund will go down because new mortgages will pay higher interest.", "The value of the mortgage fund should go up because mortgages will now be earning higher interest.", "The mortgage fund will not be affected.", "The mortgage fund will not be affected because mortgages do not react like bonds."], correctIndex: 0, feedback: "When interest rates rise, the value of existing mortgages in the fund falls." },
    { questionText: "Interest rates are rising and the stock market is volatile. What should you do with a balanced fund (50% bonds / 50% equities)?", options: ["Temporarily move a significant amount into money market securities.", "None - the fund is balanced.", "Increase the allocation to equities.", "Increase the allocation to bonds."], correctIndex: 0, feedback: "Move to money market securities for protection during rising rates and volatility." },
    { questionText: "Which statement best describes key differences between dividend funds and standard equity funds?", options: ["Standard equity funds' objectives do not include current dividend income.", "Standard equity funds' objectives are based on a belief in market efficiency.", "Standard equity funds cannot invest in preferred shares.", "Standard equity funds' objectives do not include capital preservation."], correctIndex: 0, feedback: "Dividend funds focus on current income while standard equity funds focus on capital growth." },
    { questionText: "You are concerned about upcoming weakness in the Canadian dollar. Which type of fund should you invest in?", options: ["A global fund that does not hedge its foreign currency risk.", "A global fund that hedges its foreign currency risk.", "A specialty fund that uses derivatives to hedge.", "An international fund that hedges its foreign currency risk."], correctIndex: 0, feedback: "A global fund that does not hedge benefits from a declining Canadian dollar." },
    { questionText: "What is the implicit cost of principal protected notes?", options: ["Performance participation caps.", "Early redemption fees.", "Commissions.", "Structuring costs and guarantee fees."], correctIndex: 3, feedback: "Structuring costs and guarantee fees are the implicit costs of principal protected notes." },
    { questionText: "What type of managed fund allows greater use of short sales, leverage, and derivatives compared to mutual funds?", options: ["Principal-protected notes.", "Liquid alts.", "Private equity.", "Closed-end discretionary fund."], correctIndex: 1, feedback: "Liquid alternatives (Liquid alts) allow greater use of these strategies." },
    { questionText: "An investor wants a low-cost, flexible way to mirror the performance of the energy sector. Which product is best?", options: ["Direct investment in energy sector stocks.", "Energy sector segregated fund.", "Energy-sector index mutual fund.", "Exchange-traded fund of energy sector stocks."], correctIndex: 3, feedback: "ETFs are low-cost and highly flexible." },
    { questionText: "The performance of ABC Mutual Fund ranks 54 out of 100 funds in its peer group. What is its quartile ranking?", options: ["2nd quartile.", "4th quartile.", "1st quartile.", "3rd quartile."], correctIndex: 1, feedback: "54th rank falls in the 4th quartile (51-100)." },
    { questionText: "Which drawback of the comparison universe method makes average fund managers look more like underperformers as the comparison period lengthens?", options: ["Universe size.", "Survivorship bias.", "Definition of universes.", "Matching risk profiles."], correctIndex: 1, feedback: "Survivorship bias." },
    { questionText: "What type of fund offers the highest expected risk and the highest expected return?", options: ["Canadian Equity fund.", "Mortgage fund.", "Real estate fund.", "Specialty fund."], correctIndex: 3, feedback: "Specialty funds generally have the highest risk and return potential." },
    { questionText: "A fund manager has diversified the equity portfolio to reduce the potential negative impact of unfavorable information relating to any one stock. What type of risk has he reduced?", options: ["Interest rate risk.", "Unique risk.", "Market risk.", "Default risk."], correctIndex: 1, feedback: "Unique (unsystematic) risk has been reduced." },
    { questionText: "You compare the performance of ABC Equity Fund and XYZ Equity Fund to their benchmark. Which statement is correct?", options: ["Fund XYZ offered less protection on the downside.", "Fund ABC showed greater consistency in its simple annual returns.", "Fund XYZ would have offered a lower likelihood of loss.", "Fund ABC demonstrated a superior performance in a bearish market."], correctIndex: 0, feedback: "Fund XYZ offered less protection on the downside (it fell only 8% vs ABC's 10% in Year 1)." },
    { questionText: "What type of fee does a mutual fund sponsor often reduce the longer an investor holds a back-end load fund?", options: ["Sales fee.", "Trailer fee.", "Acquisition fee.", "Redemption fee."], correctIndex: 3, feedback: "The redemption fee (deferred sales charge) often decreases the longer the investor holds the fund." },
    { questionText: "Which factors would cause the management expense ratio charged by a mutual fund to be higher?", options: ["3 and 4", "1 and 2", "1 and 4", "2 and 3"], correctIndex: 2, feedback: "Investing in foreign equities (higher costs) and paying trailer fees increase the MER." },
    { questionText: "An investor purchases equity fund units for $17.60. In which circumstance would an investor potentially owe taxes on capital gains?", options: ["The fund is sold today for $18.80 per unit and the proceeds are reinvested.", "The fund is currently valued at $16.45 per unit.", "The fund is currently valued at $18.80 per unit.", "A dividend distribution is reinvested into additional units of the same fund."], correctIndex: 0, feedback: "Capital gains are realized when the investor sells the units at a higher price than their cost." },
    { questionText: "Which exemplifies the tendency of mutual fund companies to shut down poor performing funds?", options: ["Survivorship bias.", "Short selling.", "Standard lot.", "Standby underwriting."], correctIndex: 0, feedback: "Survivorship bias occurs when poor performing funds are closed." },
    { questionText: "Which index would investors use as a benchmark for the largest listed public companies in the US marketplace?", options: ["MSCI EAFE Index.", "S&P/TSX Composite.", "FTSE Canada Universe Bond Index.", "S&P 500."], correctIndex: 3, feedback: "The S&P 500 is the main benchmark for large US companies." },
    { questionText: "Which Sharpe ratio result would indicate that the fund earned a return less than the risk-free return?", options: ["1", "0.5", "2.5", "-0.2"], correctIndex: 3, feedback: "A negative Sharpe ratio means the fund underperformed the risk-free rate." },
    { questionText: "What equity investment philosophy places greater emphasis on industry weighting than on security selection?", options: ["Sector rotation.", "Momentum investing.", "Growth investing.", "Growth at a reasonable price."], correctIndex: 0, feedback: "Sector rotation strategy emphasizes industry/sector weighting." },
    { questionText: "A fund manager using interest rate anticipation philosophy forecasts a rise in interest rates. What change should he make?", options: ["Increase long-term bond and low coupon bond holdings.", "Increase long-term and high coupon bond holdings.", "Increase short-term T-bill and low coupon bond holdings.", "Increase short-term T-bill and high coupon bond holdings."], correctIndex: 2, feedback: "When rates are expected to rise, managers shorten duration by holding more short-term securities." },
    { questionText: "Your soon-to-be retired client has $700,000 and does not want to leave a legacy. Which systematic withdrawal plan is best?", options: ["Ratio withdrawal plan.", "Fixed-dollar withdrawal plan.", "Life withdrawal plan.", "Annuity."], correctIndex: 3, feedback: "An annuity provides guaranteed income for life." },
    { questionText: "In what circumstance would an investor receive a T3 or T5 reporting a capital gain from a mutual fund investment?", options: ["When the fund sells investments at a price higher than the average cost.", "When the value of the investor's fund units has risen.", "When the value of the fund's investments has risen.", "When the investor sells her fund units at a price higher than their average cost."], correctIndex: 0, feedback: "Capital gains are reported when the fund itself realizes gains by selling securities." },
    { questionText: "What is the main advantage of index funds?", options: ["They try to beat the market.", "They have very low management fees.", "They are actively managed.", "They only invest in Canadian stocks."], correctIndex: 1, feedback: "Index funds have very low MERs because they are passively managed." },
    { questionText: "Which of the following is a characteristic of segregated funds?", options: ["They offer no guarantee.", "They have creditor protection and reset features.", "They are only available to institutional investors.", "They cannot be redeemed before maturity."], correctIndex: 1, feedback: "Segregated funds offer maturity and death guarantees, creditor protection, and reset options." },
    { questionText: "What does a high turnover rate in a mutual fund indicate?", options: ["Low trading costs.", "High portfolio stability.", "Frequent buying and selling of securities.", "Passive management style."], correctIndex: 2, feedback: "High turnover means the fund manager is actively trading securities frequently." },
    { questionText: "Which document must be delivered to investors before they purchase a mutual fund?", options: ["Annual Report.", "Fund Facts.", "Simplified Prospectus.", "Management Report of Fund Performance."], correctIndex: 1, feedback: "Fund Facts must be delivered before the purchase." },
    { questionText: "What is the purpose of the Independent Review Committee (IRC)?", options: ["To manage the fund's investments.", "To review and approve conflict of interest matters.", "To set the fund's investment objectives.", "To market the fund to investors."], correctIndex: 1, feedback: "The IRC reviews conflict of interest issues." },
    { questionText: "What is the difference between a load fund and a no-load fund?", options: ["Load funds have higher management fees.", "Load funds charge a sales commission.", "No-load funds cannot be sold by representatives.", "Load funds are only for institutional investors."], correctIndex: 1, feedback: "Load funds charge a sales commission (front-end or back-end load)." },
    { questionText: "Which of the following is true about beta?", options: ["Beta measures total risk.", "Beta measures systematic (market) risk.", "A beta of 1 means the fund is risk-free.", "Higher beta means lower volatility."], correctIndex: 1, feedback: "Beta measures a fund's sensitivity to market movements (systematic risk)." },
    { questionText: "What is the standard deviation used to measure?", options: ["Return.", "Volatility / Risk.", "Liquidity.", "Dividend yield."], correctIndex: 1, feedback: "Standard deviation is the most common measure of volatility/risk." },
    { questionText: "A client in the highest tax bracket wants tax-efficient investments. Which is best?", options: ["Money market fund.", "Canadian equity fund.", "Foreign bond fund.", "T-bill fund."], correctIndex: 1, feedback: "Canadian equity funds benefit from dividend tax credit and capital gains treatment." },
    { questionText: "What does the Management Expense Ratio (MER) include?", options: ["Only management fees.", "Management fees, operating expenses, and trailer fees.", "Sales commissions only.", "Performance fees only."], correctIndex: 1, feedback: "MER includes management fees, operating expenses, and trailer fees." },
    { questionText: "Which statement is correct regarding ETFs?", options: ["ETFs can only be bought at the end of the day.", "ETFs trade on stock exchanges throughout the day.", "ETFs always have higher fees than mutual funds.", "ETFs cannot be sold short."], correctIndex: 1, feedback: "ETFs trade on exchanges like stocks throughout the trading day." },
    { questionText: "What is the Know Your Client (KYC) rule primarily about?", options: ["Marketing the product.", "Collecting client information to ensure suitability.", "Calculating taxes.", "Preparing financial statements."], correctIndex: 1, feedback: "KYC is essential for determining investment suitability." },
    { questionText: "What does a Deferred Sales Charge (DSC) refer to?", options: ["Front-end commission.", "Back-end redemption fee that declines over time.", "Annual management fee.", "Trailer fee."], correctIndex: 1, feedback: "DSC is a back-end load that typically decreases the longer you hold the fund." },
    { questionText: "Which of the following is a benefit of diversification?", options: ["Guaranteed higher returns.", "Reduction of unsystematic risk.", "Elimination of all risk.", "Higher management fees."], correctIndex: 1, feedback: "Diversification primarily reduces unique (unsystematic) risk." },
    { questionText: "What is the primary role of the Mutual Fund Dealers Association (MFDA)?", options: ["To regulate mutual funds directly.", "To regulate mutual fund dealers and their representatives.", "To set interest rates.", "To manage the TSX."], correctIndex: 1, feedback: "The MFDA regulates mutual fund dealers and sales representatives." },
    { questionText: "Which Sharpe ratio result would indicate that the fund earned a return less than the risk-free return?", options: ["1", "0.5", "2.5", "-0.2"], correctIndex: 3, feedback: "A negative Sharpe ratio indicates the fund performed worse than the risk-free rate." }
  ]
};

const seedDatabase = async () => {
  try {
    await initDB();
    const quizzes = await getAllQuizzes();
    if (quizzes.length === 0) {
      console.log('Seeding database with IFIC Quiz 1...');
      const quizId = await addQuiz(ificQuiz1.title);
      const questionsWithQuizId = ificQuiz1.questions.map(q => ({
        quizId,
        questionText: q.questionText,
        options: q.options,
        correctIndex: q.correctIndex,
        feedback: q.feedback
      }));
      await addQuestions(questionsWithQuizId);
      console.log('Database seeded successfully with 100 questions!');
    }
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

export default function HomeScreen({ navigation }) {
  const [quizzes, setQuizzes] = useState([]);
  const [quizData, setQuizData] = useState({}); // { quizId: { questionCount, progress } }
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      // Auto-seed if no quizzes exist
      await seedDatabase();

      const allQuizzes = await getAllQuizzes();
      setQuizzes(allQuizzes);

      // Load question counts and progress for each quiz
      const data = {};
      for (const quiz of allQuizzes) {
        const questions = await getQuestionsByQuizId(quiz.id);
        const progress = await getProgressByQuizId(quiz.id);
        data[quiz.id] = {
          questionCount: questions.length,
          progress: progress
        };
      }
      setQuizData(data);
    } catch (error) {
      console.error('Error loading quizzes:', error);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      await loadData();
      setLoading(false);
    };
    init();
  }, [loadData]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadData();
    });
    return unsubscribe;
  }, [navigation, loadData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleStart = (quizId) => {
    navigation.navigate('Quiz', { quizId, startFresh: true });
  };

  const handleResume = (quizId) => {
    navigation.navigate('Quiz', { quizId, startFresh: false });
  };

  const handleRestart = async (quizId) => {
    await clearProgress(quizId);
    navigation.navigate('Quiz', { quizId, startFresh: true });
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50 items-center justify-center">
        <ActivityIndicator size="large" color="#0f766e" />
        <Text className="text-slate-500 mt-4 font-medium">Preparing your quiz workspace...</Text>
      </SafeAreaView>
    );
  }

  const totalQuestions = Object.values(quizData).reduce((sum, item) => sum + (item.questionCount || 0), 0);
  const answeredQuestions = Object.values(quizData).reduce((sum, item) => (
    sum + getAnsweredCount(item.progress?.answers || {})
  ), 0);
  const activeQuizzes = Object.values(quizData).filter(item => item.progress).length;
  const overallProgress = totalQuestions > 0 ? Math.round((answeredQuestions / totalQuestions) * 100) : 0;

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="bg-white border-b border-slate-200 px-6 pt-4 pb-5">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <View className="w-11 h-11 rounded-2xl bg-teal-700 items-center justify-center mr-3">
              <Sparkles size={22} color="white" />
            </View>
            <View>
              <Text className="text-slate-950 text-2xl font-bold">IFIC Practice</Text>
              <Text className="text-slate-500 text-sm">Build exam confidence one question at a time</Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView
        className="flex-1 px-6"
        contentContainerStyle={{ paddingTop: 20, paddingBottom: 112 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#0f766e" />
        }
      >
        <View className="bg-slate-950 rounded-2xl p-5 mb-5">
          <Text className="text-teal-200 text-sm font-semibold">Study dashboard</Text>
          <Text className="text-white text-3xl font-bold mt-2">Ready for your next session?</Text>
          <Text className="text-slate-300 mt-2 leading-5">
            Continue a saved attempt or start fresh with a clean scorecard.
          </Text>

          <View className="flex-row bg-white rounded-2xl mt-5 p-4">
            <View className="flex-1 items-center border-r border-slate-200">
              <ClipboardList size={22} color="#0f766e" />
              <Text className="text-2xl font-bold text-slate-950 mt-1">{quizzes.length}</Text>
              <Text className="text-xs text-slate-500 text-center">Quizzes</Text>
            </View>
            <View className="flex-1 items-center border-r border-slate-200">
              <CheckCircle2 size={22} color="#16a34a" />
              <Text className="text-2xl font-bold text-slate-950 mt-1">{answeredQuestions}</Text>
              <Text className="text-xs text-slate-500 text-center">Answered</Text>
            </View>
            <View className="flex-1 items-center">
              <BarChart3 size={22} color="#f59e0b" />
              <Text className="text-2xl font-bold text-slate-950 mt-1">{overallProgress}%</Text>
              <Text className="text-xs text-slate-500 text-center">Progress</Text>
            </View>
          </View>
        </View>

        <View className="flex-row items-center justify-between mb-3">
          <View>
            <Text className="text-xl font-bold text-slate-950">Your quizzes</Text>
            <Text className="text-sm text-slate-500">{activeQuizzes} active attempt{activeQuizzes === 1 ? '' : 's'}</Text>
          </View>
        </View>

        {quizzes.length === 0 ? (
          <View className="items-center justify-center py-20 bg-white rounded-2xl border border-slate-200">
            <Text className="text-slate-700 text-lg font-bold">No quizzes available</Text>
            <Text className="text-slate-500 text-sm mt-2">Add a quiz to get started</Text>
          </View>
        ) : (
          quizzes.map(quiz => (
            <QuizCard
              key={quiz.id}
              quiz={quiz}
              questionCount={quizData[quiz.id]?.questionCount || 0}
              progress={quizData[quiz.id]?.progress || null}
              onStart={() => handleStart(quiz.id)}
              onResume={quizData[quiz.id]?.progress ? () => handleResume(quiz.id) : null}
              onRestart={quizData[quiz.id]?.progress ? () => handleRestart(quiz.id) : null}
            />
          ))
        )}
      </ScrollView>

      <TouchableOpacity
        onPress={() => navigation.navigate('AddQuiz')}
        activeOpacity={0.9}
        className="absolute bottom-7 right-6 w-16 h-16 bg-teal-700 rounded-full items-center justify-center shadow-lg"
      >
        <Plus size={28} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
