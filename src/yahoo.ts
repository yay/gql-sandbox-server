type OHLC = {
  time: number; // UTC timestamp
  open: number;
  high: number;
  low: number;
  close: number;
  adjClose: number;
  volume: number;
};

enum DataFrequency {
  DAY,
  WEEK,
  MONTH,
}

type YFinanceAuth = {
  cookie: string;
  crumb: string;
};

const chromeUserAgent =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) ' +
  'AppleWebKit/537.36 (KHTML, like Gecko) ' +
  'Chrome/69.0.3497.100 Safari/537.36';

export function getYFinanceAuth(symbol: string): Promise<YFinanceAuth> {
  return fetch('https://uk.finance.yahoo.com/quote/$symbol/history', {
    headers: {
      'User-Agent': chromeUserAgent,
    },
  })
    .then((response) => {
      return response.text();
    })
    .then((data) => {
      const cookie = 'lol';
      const crumb = 'haha';
      return {
        cookie,
        crumb,
      } as YFinanceAuth;
    });
  // const request = Request.Builder()
  //         .addHeader("User-Agent", UserAgents.chrome)
  //         .url(requestUrl)
  //         .build()
  //         const response = HttpClients.main.newCall(request).execute()
  //         const body = response.body ?: throw Exception("The response has no body.")

  // const cookieHeader = response.headers("set-cookie")

  // if (cookieHeader) {
  //     val cookie = response.headers("set-cookie").first().split(";").first()
  //     // Example: "CrumbStore":{"crumb":"l45fI\u002FklCHs"}
  //     // val crumbRegEx = Regex(""".*"CrumbStore":\{"crumb":"([^"]+)"}""", RegexOption.MULTILINE)
  //     // val crumb = crumbRegEx.find("body.string()")?.groupValues?.get(1) // takes ages
  //     val text = body.string()
  //     val keyword = "CrumbStore\":{\"crumb\":\""
  //     val start = text.indexOf(keyword)
  //     val end = text.indexOf("\"}", start)
  //     val crumb = text.substring(start + keyword.length until end)
  //     if (crumb.isBlank()) {
  //         throw Exception("Crumb is blank.")
  //     }
  //     return YFinanceAuth(cookie, crumb)
  // } else {
  //     throw Exception("No cookie found.")
  // }
}
