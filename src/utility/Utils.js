import { DefaultRoute } from '../router/routes'

// ** Checks if an object is empty (returns boolean)
export const isObjEmpty = (obj) => Object.keys(obj).length === 0

// ** Returns K format from a number
export const kFormatter = (num) =>
  num > 999 ? `${(num / 1000).toFixed(1)}k` : num

// ** Converts HTML to string
export const htmlToString = (html) => html.replace(/<\/?[^>]+(>|$)/g, '')

export const formatNumberWithCommas = (number = 0) => {
  // Add two decimal places with trailing zeros if there are no decimals
  const formattedNumber =
    number % 1 === 0 ? number.toFixed(2) : number.toString()

  return formattedNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

// ** Checks if the passed date is today
const isToday = (date) => {
  const today = new Date()
  return (
    /* eslint-disable operator-linebreak */
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
    /* eslint-enable */
  )
}

/**
 ** Format and return date in Humanize format
 ** Intl docs: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/format
 ** Intl Constructor: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
 * @param {String} value date to format
 * @param {Object} formatting Intl object to format with
 */
export const formatDate = (
  value,
  formatting = { month: 'short', day: 'numeric', year: 'numeric' }
) => {
  if (!value) return value
  return new Intl.DateTimeFormat('en-US', formatting).format(new Date(value))
}

// ** Returns short month of passed date
export const formatDateToMonthShort = (value, toTimeForCurrentDay = true) => {
  const date = new Date(value)
  let formatting = { month: 'short', day: 'numeric' }

  if (toTimeForCurrentDay && isToday(date)) {
    formatting = { hour: 'numeric', minute: 'numeric' }
  }

  return new Intl.DateTimeFormat('en-US', formatting).format(new Date(value))
}

// ** Chats Date formatter
export const formatChatDate = (
  timestampInSeconds,
  toTimeForCurrentDay = true
) => {
  const date = new Date(timestampInSeconds * 1000)
  let formatting = { month: 'short', day: 'numeric' }

  if (toTimeForCurrentDay && isToday(date)) {
    formatting = { hour: 'numeric', minute: 'numeric' }
  }

  return new Intl.DateTimeFormat('en-US', formatting).format(
    new Date(timestampInSeconds)
  )
}

/**
 ** Return if user is logged in
 ** This is completely up to you and how you want to store the token in your frontend application
 *  ? e.g. If you are using cookies to store the application please update this function
 */
export const isUserLoggedIn = () => localStorage.getItem('userData')
export const getUserData = () => JSON.parse(localStorage.getItem('userData'))

/**
 ** This function is used for demo purpose route navigation
 ** In real app you won't need this function because your app will navigate to same route for each users regardless of ability
 ** Please note role field is just for showing purpose it's not used by anything in frontend
 ** We are checking role just for ease
 * ? NOTE: If you have different pages to navigate based on user ability then this function can be useful. However, you need to update it.
 * @param {String} userRole Role of user
 */
export const getHomeRouteForLoggedInUser = (userRole) => {
  if (userRole === 'agent') return DefaultRoute
  return '/login'
}

// ** React Select Theme Colors
export const selectThemeColors = (theme) => ({
  ...theme,
  colors: {
    ...theme.colors,
    primary25: '#7367f01a', // for option hover bg-color
    primary: '#7367f0', // for selected option bg-color
    neutral10: '#7367f0', // for tags bg-color
    neutral20: '#ededed', // for input border-color
    neutral30: '#ededed', // for input hover border-color
  },
})

// ** Toast Content
export const ToastContent = ({ msg }) => {
  return (
    <div className='d-flex'>
      <span>{msg}</span>
    </div>
  )
}

export const marketOptions = [
  { label: 'Select...', value: '' },
  { label: 'Forex', value: 'Forex' },
  { label: 'Stocks', value: 'Stocks' },
  { label: 'Crypto Currency', value: 'Crypto Currency' },
  { label: 'Futures', value: 'Futures' },
  { label: 'Indices', value: 'Indices' },
  { label: 'Bonds', value: 'Bonds' },
  { label: 'Insurance', value: 'Insurance' },
  { label: 'Real Estate', value: 'Real Estate' },
  { label: 'Credit Card', value: 'Credit Card' },
  { label: 'Mutual Funds', value: 'Mutual Funds' },
  { label: 'Options', value: 'Options' },
  { label: 'Commoities', value: 'Commodities' },
]

export const instrumentsOptions = (market) => {
  switch (market) {
    case 'Stocks':
      return [
        'Apple Inc. (AAPL)',
        'Microsoft Corporation (MSFT)',
        'Amazon.com Inc. (AMZN)',
        'Tesla, Inc. (TSLA)',
        'Alphabet Inc. (GOOGL)',
        'Facebook, Inc. (FB)',
        'Coca-Cola Company (KO)',
        'Visa Inc. (V)',
        'Johnson & Johnson (JNJ)',
        'Walt Disney Company (DIS)',
        'Netflix, Inc. (NFLX)',
        'Adobe Inc. (ADBE)',
        'Intel Corporation (INTC)',
        'Bank of America Corporation (BAC)',
        'Pfizer Inc. (PFE)',
        'Walmart Inc. (WMT)',
        'General Electric Company (GE)',
        'AT&T Inc. (T)',
        "McDonald's Corporation (MCD)",
        'Exxon Mobil Corporation (XOM)',
      ].map((instrument) => ({ label: instrument, value: instrument }))

    case 'Forex':
      return [
        'EUR/USD',
        'GBP/USD',
        'USD/JPY',
        'AUD/USD',
        'USD/CAD',
        'NZD/USD',
        'USD/CHF',
        'EUR/GBP',
        'EUR/JPY',
        'GBP/JPY',
        'USD/CNY',
        'USD/HKD',
        'USD/SGD',
        'USD/INR',
        'USD/MXN',
        'USD/SEK',
        'USD/NOK',
        'USD/DKK',
        'USD/THB',
        'USD/ZAR',
      ].map((instrument) => ({ label: instrument, value: instrument }))

    case 'Crypto Currency':
      return [
        'Bitcoin (BTC)',
        'Ethereum (ETH)',
        'Ripple (XRP)',
        'Litecoin (LTC)',
        'Bitcoin Cash (BCH)',
        'Cardano (ADA)',
        'Polkadot (DOT)',
        'Solana (SOL)',
        'Dogecoin (DOGE)',
        'Chainlink (LINK)',
        'Stellar (XLM)',
        'Uniswap (UNI)',
        'Polygon (MATIC)',
        'VeChain (VET)',
        'EOS (EOS)',
        'Filecoin (FIL)',
        'Tron (TRX)',
        'Avalanche (AVAX)',
        'Cosmos (ATOM)',
        'Terra (LUNA)',
      ].map((instrument) => ({ label: instrument, value: instrument }))
    case 'Commodities':
      return [
        'Gold (XAU/USD)',
        'Silver (XAG/USD)',
        'Crude Oil (CL)',
        'Natural Gas (NG)',
        'Copper (HG)',
        'Corn (ZC)',
        'Wheat (ZW)',
        'Soybeans (ZS)',
        'Platinum (PL)',
        'Palladium (PA)',
        'Coffee (KC)',
        'Cocoa (CC)',
        'Sugar (SB)',
        'Cotton (CT)',
        'Live Cattle (LE)',
        'Lean Hogs (HE)',
        'Aluminum (ALI)',
        'Nickel (NI)',
        'Zinc (ZI)',
        'Lead (PB)',
      ].map((instrument) => ({ label: instrument, value: instrument }))
    case 'Bonds':
      return [
        'U.S. Treasury Bonds',
        'Municipal Bonds',
        'Corporate Bonds',
        'International Sovereign Bonds',
        'High-Yield Bonds',
        'Government Bonds (Various countries)',
        'Convertible Bonds',
        'Agency Bonds',
        'Zero-Coupon Bonds',
        'Inflation-Linked Bonds',
      ].map((instrument) => ({ label: instrument, value: instrument }))
    case 'Futures':
      return [
        'E-mini Nasdaq 100 Futures (NQ)',
        'Mini Dow Futures (YM)',
        'Russell 2000 Mini Futures (RTY)',
        'FTSE 100 Index Futures (Z)',
        'Euro Stoxx 50 Index Futures (FESX)',
        'Nikkei 225 Index Futures (NKD)',
        'S&P/ASX 200 Futures (AP)',
        'DAX Index Futures (FDAX)',
        'Hang Seng Index Futures (HSI)',
        'CAC 40 Index Futures (FCE)',
      ].map((instrument) => ({ label: instrument, value: instrument }))
    case 'Mutual Funds':
      return [
        'SPDR S&P 500 ETF Trust (SPY)',
        'Invesco QQQ Trust (QQQ)',
        'Vanguard Total Stock Market ETF (VTI)',
        'iShares Russell 2000 ETF (IWM)',
        'Financial Select Sector SPDR Fund (XLF)',
        'Technology Select Sector SPDR Fund (XLK)',
        'iShares Core U.S. Aggregate Bond ETF (AGG)',
        'Vanguard Total International Stock ETF (VXUS)',
        'Fidelity 500 Index Fund (FXAIX)',
        'PIMCO Total Return Fund (PTTRX)',
        'Vanguard Total Bond Market ETF (BND)',
        'Vanguard FTSE Emerging Markets ETF (VWO)',
        'ARK Innovation ETF (ARKK)',
        'SPDR Gold Trust (GLD)',
        'iShares MSCI EAFE ETF (EFA)',
        'Vanguard Real Estate ETF (VNQ)',
        'WisdomTree Europe Hedged Equity Fund (HEDJ)',
      ].map((instrument) => ({ label: instrument, value: instrument }))
    case 'Indices':
      return [
        'S&P 500 Index (^GSPC)',
        'Dow Jones Industrial Average (^DJI)',
        'NASDAQ Composite Index (^IXIC)',
        'FTSE 100 Index (^FTSE)',
        'DAX Index (^GDAXI)',
        'Nikkei 225 Index (^N225)',
        'Shanghai Composite Index (^SSEC)',
        'CAC 40 Index (^FCHI)',
        'Hang Seng Index (^HSI)',
        'BSE Sensex (^BSESN)',
      ].map((instrument) => ({ label: instrument, value: instrument }))
    case 'Insurance':
      return [
        'Health Insurance Fraud',
        'Auto Insurance Fraud',
        'Life Insurance Fraud',
        'Property Insurance Fraud',
      ].map((instrument) => ({ label: instrument, value: instrument }))

    case 'Credit Card':
      return [
        'Credit Card Skimming',
        'Identity Theft',
        'Phishing Scams',
        'Card Not Present Fraud',
      ].map((instrument) => ({ label: instrument, value: instrument }))
    case 'Real Estate':
      return [
        'Mortgage Fraud',
        'Property Flipping Fraud',
        'Foreclosure Rescue Scams',
        'Rental Fraud',
      ].map((instrument) => ({ label: instrument, value: instrument }))

    case 'Options':
      return [
        'S&P 500 Futures (ES)',
        'NASDAQ-100 Futures (NQ)',
        'Dow Jones Industrial Average Futures (YM)',
        'Crude Oil Futures (CL)',
        'Gold Options (GC)',
        'EUR/USD Options (EUO)',
        'Treasury Bond Futures (ZB)',
        'Natural Gas Options (NGO)',
        'VIX Futures (VX)',
        'Bitcoin Futures (BTC)',
        'Nikkei 225 Futures (NKD)',
        'Eurodollar Futures (GE)',
        'Copper Futures (HG)',
        'Corn Options (C)',
        'Wheat Futures (W)',
        'Soybean Futures (S)',
        'Russell 2000 Futures (RTY)',
        'CME E-mini S&P 500 Futures (E-mini ES)',
        'CBOE Volatility Index Futures (VIX)',
        'Apple Inc. Call Options (AAPL call options)',
        'Microsoft Corporation Put Options (MSFT put options)',
        'SPDR S&P 500 ETF Options (SPY options)',
        'Amazon.com Inc. Call Options (AMZN call options)',
        'Facebook, Inc. Put Options (FB put options)',
        'Google (Alphabet) Call Options (GOOGL call options)',
        'Tesla, Inc. Put Options (TSLA put options)',
        'Visa Inc. Call Options (V call options)',
        'Johnson & Johnson Put Options (JNJ put options)',
        'Walt Disney Company Call Options (DIS call options)',
        'Netflix, Inc. Put Options (NFLX put options)',
        'Adobe Inc. Call Options (ADBE call options)',
        'Intel Corporation Put Options (INTC put options)',
        'Bank of America Corporation Call Options (BAC call options)',
        'Pfizer Inc. Put Options (PFE put options)',
        'Walmart Inc. Call Options (WMT call options)',
        'General Electric Company Put Options (GE put options)',
        'AT&T Inc. Call Options (T call options)',
        "McDonald's Corporation Put Options (MCD put options)",
        'Exxon Mobil Corporation Call Options (XOM call options)',
      ].map((instrument) => ({ label: instrument, value: instrument }))
  }
}
