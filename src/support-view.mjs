import { arrow, discordUrl } from './layout.mjs';

const amounts = [5, 10, 25, 50];

export function renderSupport() {
  return `<section class="page-head wrap">
  <p class="eyebrow">Support</p>
  <h1>Keep Modstoke going</h1>
  <p class="lede">Our mods and tools are free. They're made by OpenACAI, a 501(c)(3) nonprofit, and donations pay for the server behind this site, our Discord bot and the community servers.</p>
</section>

<section class="wrap block support">
  <div class="donate-panel">
    <h2>Donate</h2>
    <form class="donate" id="donate" hidden>
      <fieldset class="segmented">
        <legend class="sr-only">How often</legend>
        <label><input type="radio" name="kind" value="once" checked><span>One time</span></label>
        <label><input type="radio" name="kind" value="monthly"><span>Monthly</span></label>
      </fieldset>
      <fieldset class="segmented amounts">
        <legend class="sr-only">Amount in US dollars</legend>
${amounts.map((amount, i) => `        <label><input type="radio" name="amount" value="${amount}"${i === 1 ? ' checked' : ''}><span>$${amount}</span></label>`).join('\n')}
        <label class="other"><span class="sr-only">Other amount</span><input type="number" name="other" min="2" max="1000" step="1" inputmode="numeric" placeholder="Other $"></label>
      </fieldset>
      <div id="paypal-buttons" class="paypal-buttons"></div>
      <p class="donate-status" id="donate-status" role="status"></p>
    </form>
    <p class="donate-closed" id="donate-closed">Online donations open soon. Until then, ask in our <a href="${discordUrl}">Discord</a> how to help.</p>
    <p class="aside-note">Payments go through PayPal, which emails you a receipt. We never see your card details.</p>
  </div>
  <div>
    <h2>Supporter roles</h2>
    <p>Donors get a role in our Discord as a thank-you:</p>
    <dl class="roles">
      <div><dt>Supporter</dt><dd>Anyone who has donated</dd></div>
      <div><dt>Monthly supporter</dt><dd>While a monthly donation is running</dd></div>
      <div><dt>Server host</dt><dd>Anyone renting a <a href="/hosting/">server from us</a></dd></div>
    </dl>
    <p>Until accounts open, message a moderator in Discord with your PayPal receipt number and they'll add the role. The roles are a thank-you only. The mods stay free for everyone either way.</p>
  </div>
</section>

<section class="wrap block setup" id="gamhon">
  <div>
    <h2>Part of GAMHON</h2>
    <p>Modstoke is part of GAMHON, the Game and Mental Health Online Network. OpenACAI runs it to give people a low-pressure social outlet through games, including people who don't have many other places to connect.</p>
    <p>Modding fits right in. Like any hobby, it gives you something to work on and something to look forward to, and it comes with a community of people building things together. Our free tools, our Discord and the servers we host are all part of that.</p>
    <p>Donations made here and fees for <a href="/hosting/">server hosting</a> go to OpenACAI and help fund the program.</p>
    <p class="aside-note">GAMHON is about recreation and friendship, not counseling. If you're in crisis in the US, call or text 988.</p>
    <p><a class="text-link" href="https://openacai.com/g-a-m-h-o-n/">More about GAMHON on openacai.com ${arrow}</a></p>
  </div>
  <div>
    <h2>Where the money goes</h2>
    <p>The server comes first. One machine in New Jersey runs this site, Sentinel (our Discord bot) and its local AI, and the game servers we host. Anything beyond that goes to the rest of GAMHON.</p>
    <p><a class="text-link" href="${discordUrl}">Questions? Ask in Discord ${arrow}</a></p>
  </div>
</section>`;
}
