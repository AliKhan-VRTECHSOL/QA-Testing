import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SAScrollView } from '../../../../components';

const PrivacyPolicy = () => {
  return (
    <SAScrollView removeSafeAreaInsets>
      <View style={styles.container}>
        <Text style={styles.title}>About the App</Text>
        <Text style={styles.paragraph}>
          Welcome to Shopomation. The App provides Software Consultancy, Data, Application
          Development, and Solutions Architecture (the 'Services').
        </Text>

        <Text style={styles.paragraph}>
          The Website is operated by Shopomation PTY LTD(ACN 649351593). Access to and use of the
          Website, or any of its associated Products or Services, is provided by Shopomation PTY
          LTD. Please read these terms and conditions (the 'Terms') carefully. By using, browsing
          and/or reading the Website, this signifies that you have read, understood and agree to be
          bound by the Terms. If you do not agree with the Terms, you must cease usage of the
          Website, or any of Services, immediately.
        </Text>

        <Text style={styles.paragraph}>
          Shopomation PTY LTD reserves the right to review and change any of the Terms by updating
          this page at its sole discretion. When Shopomation PTY LTD updates the Terms, it will use
          reasonable endeavours to provide you with notice of updates to the Terms. Any changes to
          the Terms take immediate effect from the date of their publication. Before you continue,
          we recommend you keep a copy of the Terms for your records.
        </Text>

        <Text style={styles.title}>Acceptance of the Terms</Text>
        <Text style={styles.paragraph}>
          You accept the Terms by remaining on the Website. You may also accept the Terms by
          clicking to accept or agree to the Terms where this option is made available to you by
          Shopomation PTY LTD in the user interface.
        </Text>

        <Text style={styles.title}>Subscription to use the Services</Text>
        <Text style={styles.paragraph}>
          In order to access the Services, you must first purchase a subscription through the
          Website (the 'Subscription') and pay the applicable fee for the selected Subscription (the
          'Subscription Fee').
        </Text>

        <Text style={styles.paragraph}>
          In purchasing the Subscription, you acknowledge and agree that it is your responsibility
          to ensure that the Subscription you elect to purchase is suitable for your use.
        </Text>

        <Text style={styles.paragraph}>
          Once you have purchased the Subscription, you will then be required to register for an
          account through the Website before you can access the Services (the 'Account').
        </Text>

        <Text style={styles.paragraph}>
          As part of the registration process, or as part of your continued use of the Services, you
          may be required to provide personal information about yourself (such as identification or
          contact details), including:
        </Text>

        <Text style={styles.bulletPoint}>• Email address</Text>
        <Text style={styles.bulletPoint}>• Preferred username</Text>
        <Text style={styles.bulletPoint}>• Mailing address</Text>
        <Text style={styles.bulletPoint}>• Telephone number</Text>
        <Text style={styles.bulletPoint}>• Password</Text>

        <Text style={styles.paragraph}>
          You warrant that any information you give to Shopomation PTY LTD in the course of
          completing the registration process will always be accurate, correct and up to date.
        </Text>

        <Text style={styles.paragraph}>
          Once you have completed the registration process, you will be a registered member of the
          Website ('Member') and agree to be bound by the Terms. As a Member you will be granted
          immediate access to the Services from the time you have completed the registration process
          until the subscription period expires (the 'Subscription Period').
        </Text>

        <Text style={styles.paragraph}>
          You may not use the Services and may not accept the Terms if:
        </Text>
        <Text style={styles.bulletPoint}>
          • you are not of legal age to form a binding contract with Shopomation PTY LTD; or
        </Text>
        <Text style={styles.bulletPoint}>
          • you are a person barred from receiving the Services under the laws of Australia or other
          countries including the country in which you are resident or from which you use the
          Services.
        </Text>

        <Text style={styles.title}>Your obligations as a Member</Text>
        <Text style={styles.paragraph}>As a Member, you agree to comply with the following:</Text>

        <Text style={styles.paragraph}>
          • you will use the Services only for purposes that are permitted by: the Terms; and any
          applicable law, regulation or generally accepted practices or guidelines in the relevant
          jurisdictions;
        </Text>

        <Text style={styles.paragraph}>
          • you have the sole responsibility for protecting the confidentiality of your password
          and/or email address. Use of your password by any other person may result in the immediate
          cancellation of the Services; any use of your registration information by any other
          person, or third parties, is strictly prohibited. You agree to immediately notify
          Shopomation PTY LTD of any unauthorised use of your password or email address or any
          breach of security of which you have become aware;
        </Text>

        <Text style={styles.paragraph}>
          • access and use of the Website is limited, non-transferable and allows for the sole use
          of the Website by you for the purposes of Shopomation PTY LTD providing the Services; you
          will not use the Services or the Website in connection with any commercial endeavours
          except those that are specifically endorsed or approved by the management of Shopomation
          PTY LTD; you will not use the Services or Website for any illegal and/or unauthorised use
          which includes collecting email addresses of Members by electronic or other means for the
          purpose of sending unsolicited email or unauthorised framing of or linking to the Website;
        </Text>

        <Text style={styles.paragraph}>
          • you agree that commercial advertisements, affiliate links, and other forms of
          solicitation may be removed from the Website without notice and may result in termination
          of the Services. Appropriate legal action will be taken by Shopomation PTY LTD for any
          illegal or unauthorised use of the Website; and you acknowledge and agree that any
          automated use of the Website or its Services is prohibited.
        </Text>

        <Text style={styles.title}>Payment</Text>
        <Text style={styles.paragraph}>
          Where the option is given to you, you may make payment of the Subscription Fee by way of:
        </Text>

        <Text style={styles.bulletPoint}>
          • Electronic funds transfer ('EFT') into our nominated bank account
        </Text>
        <Text style={styles.bulletPoint}>• Credit Card Payment ('Credit Card')</Text>
        <Text style={styles.bulletPoint}>• PayPal ('PayPal')</Text>

        <Text style={styles.paragraph}>
          All payments made in the course of your use of the Services are made using Stripe. In
          using the Website, the Services or when making any payment in relation to your use of the
          Services, you warrant that you have read, understood and agree to be bound by the Stripe
          terms and conditions which are available on their website.
        </Text>

        <Text style={styles.paragraph}>
          You acknowledge and agree that where a request for the payment of the Subscription Fee is
          returned or denied, for whatever reason, by your financial institution or is unpaid by you
          for any other reason, then you are liable for any costs, including banking fees and
          charges, associated with the Subscription Fee.
        </Text>

        <Text style={styles.paragraph}>
          You agree and acknowledge that Shopomation PTY LTD can vary the Subscription Fee at any
          time and that the varied Subscription Fee will come into effect following the conclusion
          of the existing Subscription Period.
        </Text>

        <Text style={styles.title}>Refund Policy</Text>
        <Text style={styles.paragraph}>
          Shopomation PTY LTD requires a nonrefundable 50% deposit upfront before commencing any
          work, unless otherwise disclosed by the manager. This deposit covers labor costs for work
          performed, regardless of whether any intellectual property (IP) is delivered.
        </Text>

        <Text style={styles.paragraph}>
          A refund of the Subscription Fee may be provided only if Shopomation PTY LTD is unable to
          continue providing the Services and the value of services completed does not exceed the
          deposit amount. The manager, at their absolute discretion, may also determine that a
          refund is reasonable under specific circumstances. If a refund is granted, it will be
          proportional to the portion of the Subscription Fee or Deposit that remains unused after
          accounting for services already rendered (the "Refund"). If the value of completed work
          exceeds the deposit or subscription fee paid, no refund will be issued.
        </Text>

        <Text style={styles.title}>Copyright and Intellectual Property</Text>
        <Text style={styles.paragraph}>
          The Website, the Services, and all related products of Shopomation PTY LTD are subject to
          copyright. The material on the Website is protected under Australian copyright law and
          international treaties. Unless otherwise indicated, all rights—including copyright—in the
          Services and the compilation of the Website (including but not limited to text, graphics,
          logos, button icons, video images, audio clips, code, scripts, design elements, and
          interactive features) are owned or controlled by Shopomation PTY LTD or its contributors.
        </Text>

        <Text style={styles.paragraph}>
          All trademarks, service marks, and trade names are owned, registered, and/or licensed by
          Shopomation PTY LTD, which grants you a worldwide, non-exclusive, royalty-free, revocable
          license while you are a Member to:
        </Text>

        <Text style={styles.bulletPoint}>• Use the Website pursuant to the Terms;</Text>
        <Text style={styles.bulletPoint}>
          • Copy and store the Website and its material in your device's cache memory;
        </Text>
        <Text style={styles.bulletPoint}>
          • Print pages from the Website for your own personal, non-commercial use.
        </Text>

        <Text style={styles.paragraph}>
          Shopomation PTY LTD does not grant you any other rights in relation to the Website or the
          Services. All other rights remain expressly reserved.
        </Text>

        <Text style={styles.title}>Intellectual Property Ownership & Transfer</Text>
        <Text style={styles.paragraph}>
          Shopomation PTY LTD retains all rights, title, and interest in and to the Website and all
          related Services until full payment for all Services rendered has been received.
        </Text>

        <Text style={styles.paragraph}>
          Unless explicitly agreed in writing, nothing in your use of the Website or Services shall
          transfer any:
        </Text>

        <Text style={styles.bulletPoint}>
          • Business name, trading name, domain name, trademark, industrial design, patent,
          registered design, or copyright;
        </Text>
        <Text style={styles.bulletPoint}>
          • Right to use or exploit any business name, trading name, domain name, trademark,
          industrial design, or any system, process, or material that is the subject of a patent,
          registered design, or copyright (including adaptations or modifications thereof).
        </Text>

        <Text style={styles.paragraph}>
          If a written agreement provides for the transfer of intellectual property, such transfer
          shall only take effect once full payment has been received for all Services rendered.
          Until that point, all work, including modifications and custom developments, remains the
          exclusive property of Shopomation PTY LTD.
        </Text>

        <Text style={styles.paragraph}>
          You may not, without prior written permission from Shopomation PTY LTD and any other
          relevant rights owners:
        </Text>

        <Text style={styles.paragraph}>
          Broadcast, republish, upload to a third party, transmit, post, distribute, publicly
          display, adapt, or modify any part of the Services or third-party Services for any
          purpose, unless explicitly permitted by these Terms. This prohibition does not extend to
          materials on the Website that are freely available for reuse or in the public domain.
        </Text>

        <Text style={styles.title}>Privacy</Text>
        <Text style={styles.paragraph}>
          Shopomation PTY LTD takes your privacy seriously and any information provided through your
          use of the Website and/or Services are subject to Shopomation PTY LTD's Privacy Policy,
          which is available on the Website.
        </Text>

        <Text style={styles.title}>General Disclaimer</Text>
        <Text style={styles.paragraph}>
          Nothing in the Terms limits or excludes any guarantees, warranties, representations or
          conditions implied or imposed by law, including the Australian Consumer Law (or any
          liability under them) which by law may not be limited or excluded.
        </Text>

        <Text style={styles.paragraph}>
          Subject to this clause, and to the extent permitted by law:
        </Text>

        <Text style={styles.paragraph}>
          • all terms, guarantees, warranties, representations or conditions which are not expressly
          stated in the Terms are excluded; and
        </Text>

        <Text style={styles.paragraph}>
          • Shopomation PTY LTD will not be liable for any special, indirect or consequential loss
          or damage (unless such loss or damage is reasonably foreseeable resulting from our failure
          to meet an applicable Consumer Guarantee), loss of profit or opportunity, or damage to
          goodwill arising out of or in connection with the Services or these Terms (including as a
          result of not being able to use the Services or the late supply of the Services), whether
          at common law, under contract, tort (including negligence), in equity, pursuant to statute
          or otherwise.
        </Text>

        <Text style={styles.paragraph}>
          Use of the Website and the Services is at your own risk. Everything on the Website and the
          Services is provided to you "as is" and "as available" without warranty or condition of
          any kind. None of the affiliates, directors, officers, employees, agents, contributors and
          licensors of Shopomation PTY LTD make any express or implied representation or warranty
          about the Services or any products or Services (including the products or Services of
          Shopomation PTY LTD) referred to on the Website, includes (but is not restricted to) loss
          or damage you might suffer as a result of any of the following:
        </Text>

        <Text style={styles.bulletPoint}>
          • failure of performance, error, omission, interruption, deletion, defect, failure to
          correct defects, delay in operation or transmission, computer virus or other harmful
          component, loss of data, communication line failure, unlawful third party conduct, or
          theft, destruction, alteration or unauthorised access to records;
        </Text>
        <Text style={styles.bulletPoint}>
          • the accuracy, suitability or currency of any information on the Website, the Services,
          or any of its Services related products (including third party material and advertisements
          on the Website);
        </Text>
        <Text style={styles.bulletPoint}>
          • costs incurred as a result of you using the Website, the Services or any of the products
          of Shopomation PTY LTD;
        </Text>
        <Text style={styles.bulletPoint}>
          • the Services or operation in respect to links which are provided for your convenience.
        </Text>

        <Text style={styles.title}>Limitation of liability</Text>
        <Text style={styles.paragraph}>
          Shopomation PTY LTD's total liability arising out of or in connection with the Services or
          these Terms, however arising, including under contract, tort (including negligence), in
          equity, under statute or otherwise, will not exceed the resupply of the Services to you.
        </Text>

        <Text style={styles.paragraph}>
          You expressly understand and agree that Shopomation PTY LTD, its affiliates, employees,
          agents, contributors and licensors shall not be liable to you for any direct, indirect,
          incidental, special consequential or exemplary damages which may be incurred by you,
          however caused and under any theory of liability. This shall include, but is not limited
          to, any loss of profit (whether incurred directly or indirectly), any loss of goodwill or
          business reputation and any other intangible loss.
        </Text>

        <Text style={styles.title}>Termination of Contract</Text>
        <Text style={styles.paragraph}>
          The Terms will continue to apply until terminated by either you or by Shopomation PTY LTD
          as set out below.
        </Text>

        <Text style={styles.paragraph}>If you want to terminate the Terms, you may do so by:</Text>

        <Text style={styles.bulletPoint}>
          • not renewing the Subscription prior to the end of the Subscription Period;
        </Text>
        <Text style={styles.bulletPoint}>
          • providing Shopomation PTY LTD with 14 days' notice of your intention to terminate;
        </Text>
        <Text style={styles.bulletPoint}>
          • closing your accounts for all of the services which you use, where Shopomation PTY LTD
          has made this option available to you.
        </Text>

        <Text style={styles.paragraph}>
          Your notice should be sent, in writing, to Shopomation PTY LTD via the 'Contact Us' link
          on our homepage.
        </Text>

        <Text style={styles.paragraph}>
          Shopomation PTY LTD may at any time, terminate the Terms with you if:
        </Text>

        <Text style={styles.bulletPoint}>
          • you do not renew the Subscription at the end of the Subscription Period;
        </Text>
        <Text style={styles.bulletPoint}>
          • you have breached any provision of the Terms or intend to breach any provision;
        </Text>
        <Text style={styles.bulletPoint}>• Shopomation PTY LTD is required to do so by law;</Text>
        <Text style={styles.bulletPoint}>
          • the provision of the Services to you by Shopomation PTY LTD is, in the opinion of
          Shopomation PTY LTD, no longer commercially viable.
        </Text>

        <Text style={styles.paragraph}>
          Subject to local applicable laws, Shopomation PTY LTD reserves the right to discontinue or
          cancel your membership at any time and may suspend or deny, in its sole discretion, your
          access to all or any portion of the Website or the Services without notice if you breach
          any provision of the Terms or any applicable law or if your conduct impacts Shopomation
          PTY LTD's name or reputation or violates the rights of those of another party.
        </Text>

        <Text style={styles.title}>Indemnity</Text>
        <Text style={styles.paragraph}>
          You agree to indemnify Shopomation PTY LTD, its affiliates, employees, agents,
          contributors, third party content providers and licensors from and against:
        </Text>

        <Text style={styles.bulletPoint}>
          • all actions, suits, claims, demands, liabilities, costs, expenses, loss and damage
          (including legal fees on a full indemnity basis) incurred, suffered or arising out of or
          in connection with Your Content;
        </Text>
        <Text style={styles.bulletPoint}>
          • any direct or indirect consequences of you accessing, using or transacting on the
          Website or attempts to do so;
        </Text>
        <Text style={styles.bulletPoint}>• any breach of the Terms.</Text>

        <Text style={styles.title}>Dispute Resolution</Text>
        <Text style={styles.subtitle}>Compulsory:</Text>
        <Text style={styles.paragraph}>
          If a dispute arises out of or relates to the Terms, either party may not commence any
          Tribunal or Court proceedings in relation to the dispute, unless the following clauses
          have been complied with (except where urgent interlocutory relief is sought).
        </Text>

        <Text style={styles.subtitle}>Notice:</Text>
        <Text style={styles.paragraph}>
          A party to the Terms claiming a dispute ('Dispute') has arisen under the Terms, must give
          written notice to the other party detailing the nature of the dispute, the desired outcome
          and the action required to settle the Dispute.
        </Text>

        <Text style={styles.subtitle}>Resolution:</Text>
        <Text style={styles.paragraph}>
          On receipt of that notice ('Notice') by that other party, the parties to the Terms
          ('Parties') must:
        </Text>

        <Text style={styles.bulletPoint}>
          • Within 7 days of the Notice endeavour in good faith to resolve the Dispute expeditiously
          by negotiation or such other means upon which they may mutually agree;
        </Text>
        <Text style={styles.bulletPoint}>
          • If for any reason whatsoever, 14 days after the date of the Notice, the Dispute has not
          been resolved, the Parties must either agree upon selection of a mediator or request that
          an appropriate mediator be appointed by the President of the chosen mediation body or his
          or her nominee;
        </Text>
        <Text style={styles.bulletPoint}>
          • The Parties are equally liable for the fees and reasonable expenses of a mediator and
          the cost of the venue of the mediation and without limiting the foregoing undertake to pay
          any amounts requested by the mediator as a pre-condition to the mediation commencing. The
          Parties must each pay their own costs associated with the mediation;
        </Text>
        <Text style={styles.bulletPoint}>
          • The mediation will be held online or in person within Wollongong NSW.
        </Text>

        <Text style={styles.subtitle}>Confidential:</Text>
        <Text style={styles.paragraph}>
          All communications concerning negotiations made by the Parties arising out of and in
          connection with this dispute resolution clause are confidential and to the extent
          possible, must be treated as "without prejudice" negotiations for the purpose of
          applicable laws of evidence.
        </Text>

        <Text style={styles.subtitle}>Termination of Mediation:</Text>
        <Text style={styles.paragraph}>
          If 7 days have elapsed after the start of a mediation of the Dispute and the Dispute has
          not been resolved, either Party may ask the mediator to terminate the mediation and the
          mediator must do so.
        </Text>

        <Text style={styles.title}>Venue and Jurisdiction</Text>
        <Text style={styles.paragraph}>
          The Services offered by Shopomation PTY LTD is intended to be viewed by residents of
          Australia. In the event of any dispute arising out of or relation to the Website, you
          agree that the exclusive venue for resolving any dispute shall be in the courts of New
          South Wales, Australia.
        </Text>

        <Text style={styles.title}>Governing Law</Text>
        <Text style={styles.paragraph}>
          The Terms are governed by the laws of New South Wales, Australia. Any dispute,
          controversy, proceeding or claim of whatever nature arising out of or in any way relating
          to the Terms and the rights created hereby shall be governed, interpreted and construed
          by, under and pursuant to the laws of New South Wales, Australia, without reference to
          conflict of law principles, notwithstanding mandatory rules. The validity of this
          governing law clause is not contested. The Terms shall be binding to the benefit of the
          parties hereto and their successors and assigns.
        </Text>

        <Text style={styles.title}>Independent Legal Advice</Text>
        <Text style={styles.paragraph}>
          Both parties confirm and declare that the provisions of the Terms are fair and reasonable
          and both parties having taken the opportunity to obtain independent legal advice and
          declare the Terms are not against public policy on the grounds of inequality or bargaining
          power or general grounds of restraint of trade.
        </Text>

        <Text style={styles.title}>Severance</Text>
        <Text style={styles.paragraph}>
          If any part of these Terms is found to be void or unenforceable by a Court of competent
          jurisdiction, that part shall be severed and the rest of the Terms shall remain in force.
        </Text>
      </View>
    </SAScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingBottom: 40,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 15,
    marginBottom: 8,
    color: '#444',
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
    color: '#666',
    textAlign: 'justify',
  },
  bulletPoint: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 6,
    marginLeft: 10,
    color: '#666',
  },
});

export default PrivacyPolicy;
