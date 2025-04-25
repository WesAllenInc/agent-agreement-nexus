import React from 'react';
import { useWizard } from "../WizardContext";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function AgreementText() {
  const { formData, setFormData } = useWizard();
  const { partner_info } = formData;

  // Get current date for the agreement
  const currentDate = new Date();
  const month = currentDate.toLocaleString('default', { month: 'long' });
  const day = currentDate.getDate();
  const year = currentDate.getFullYear();
  const formattedDate = `${month} ${day}, ${year}`;

  const handleTableChange = (tableType: 'offices' | 'agents', rowIndex: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      schedule_b: {
        ...prev.schedule_b || {},
        [tableType]: {
          ...(prev.schedule_b?.[tableType] || {}),
          [rowIndex]: {
            ...(prev.schedule_b?.[tableType]?.[rowIndex] || {}),
            [field]: value
          }
        }
      }
    }));
  };

  return (
    <ScrollArea className="h-[70vh] w-full rounded-md border p-4 overflow-y-auto">
      <div className="space-y-6 text-sm text-justify">
        <h1 className="text-2xl font-bold text-center mb-6">Sales Agent Agreement</h1>
        
        <p>
          This Sales Agent Agreement ("Agreement") is made on {formattedDate} ("Effective Date") by and among WLJ Innovations, LLC, a Florida limited liability company d/b/a Ireland Pay with offices at 5000 SW 75th Avenue, Suite 131, Miami, FL 33155 ("Ireland Pay") and,
        </p>

        <div className="text-center my-4">
          <p>{partner_info.first_name} {partner_info.middle_name} {partner_info.last_name}</p>
          <p>with offices at {partner_info.business_address} ("Sales Agent")</p>
        </div>

        <p>
          and the Guarantor(s) listed on Schedule C. Ireland Pay provides merchant credit and debit card processing, check processing, software and hardware solutions, and related services. Sales Agent desires to solicit and refer merchants to Ireland Pay for those services. Therefore, for adequate consideration, the sufficiency of which is acknowledged, the parties agree as follows:
        </p>

        <section>
          <h2 className="text-xl font-semibold mb-4">I. Definitions</h2>
          <p>The following terms when used in this Agreement will have the meanings set forth in this Section:</p>
          
          <div className="space-y-4 mt-4">
            <p><strong>"Card Organization"</strong> means Visa, MasterCard, American Express, Discover, debit networks, and payment networks offered by Ireland Pay and any successor organization.</p>
            
            <p><strong>"Confidential Information"</strong> means information disclosed to Sales Agent by Ireland Pay or gained by Sales Agent in the course of its relationship with Ireland Pay including but not limited to information relating to the business of Ireland Pay (Merchant contact information, Merchant identification numbers, Merchant data, transaction information, cardholder account numbers and information, pricing, the terms of this Agreement, which the parties agree is Ireland Pay's Confidential Information), programs, devices, trade secrets, methods, processes, financial data, information identifying other independent sales offices that do business with Ireland Pay, lists of Ireland Pay customers or suppliers, computer access codes, instruction and/or procedural manuals, business and financial plans, and any other data or information which is competitively sensitive and not generally known to the public.</p>
            
            <p><strong>"Credit Card"</strong> means a valid and unexpired credit card issued by and bearing the symbols of any Card Organization.</p>
            
            <p><strong>"Debit Card"</strong> means a card bearing the symbols of debit card networks offered by Ireland Pay.</p>
            
            <p><strong>"Event of Default"</strong> means the events listed in Section 8.3.</p>
            
            <p><strong>"Loss"</strong> means any loss incurred by Ireland Pay or Sponsor attributable to a Merchant, including but not limited to fines, costs or other liabilities incurred arising out of this Agreement or any Merchant Agreement, Merchant chargebacks, uncollected Merchant fees, ACH rejects, fines, assessments, and penalties, the unauthorized access to cardholder and Merchant credential information, security breaches, Merchant bankruptcy, Merchant fraud, Card Organization investigations and fines, and other related costs.</p>
            
            <p><strong>"MasterCard"</strong> means MasterCard International, Inc., and any successor organization.</p>
            
            <p><strong>"Merchant"</strong> means a business solicited by Sales Agent that has entered into a Merchant Agreement and to which Ireland Pay provides Services under this Agreement.</p>
            
            <p><strong>"Merchant Agreement"</strong> means the written contract entered into between Sponsor and Merchant which enables the Merchant to participate in the Merchant Program.</p>
            
            <p><strong>"Merchant Program"</strong> means the package of Services offered by Ireland Pay and Sales Agent under this Agreement.</p>
            
            <p><strong>"Residual"</strong> means the amount earned by Sales Agent under this Agreement calculated pursuant to Schedule A.</p>
            
            <p><strong>"Rules"</strong> means the written regulations and procedures issued by the Card Organizations as amended from time to time.</p>
            
            <p><strong>"Services"</strong> means Credit Card and Debit Card processing, ATM, terminal programming, customer support, equipment deployment, technical support, gift, loyalty and prepaid card processing, terminal leasing, ACH, check services, software and hardware solutions and any other product or service Ireland Pay may offer from time to time.</p>
            
            <p><strong>"Sponsor"</strong> means that Visa/MasterCard sponsor financial institution that is a party to the Merchant Agreement.</p>
            
            <p><strong>"Visa"</strong> means Visa U.S.A., Inc., and any successor organization.</p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">II. Sales Agent's Obligations</h2>

          <p>
            2.1 Responsibilities of Sales Agent. On an exclusive basis, Sales Agent will market the Services and will encourage all prospective Merchants that comply with Ireland Pay's credit criteria to become Merchants. Agent will assist potential Merchants in completing all documentation required for application to the Merchant Program and will submit completed Merchant Agreements to Ireland Pay. Sates Agent will not change any term on any Merchant Agreement without Ireland Pay's prior written consent. Sales Agent will not use any marketing materials displaying Card Organization trademarks, including its website, that have not received the prior written approval of Ireland Pay. Sales Agent will use its best efforts to cause each Merchant to perform its obligations under its Merchant Agreement and Sales Agent will assist Ireland Pay in collecting any amounts due from Merchants. Sales Agent will train Merchants on the operation of all equipment and the Merchant Program. Sales Agent will provide first line customer support to Merchants. Sales Agent will not make any representation or create any liability on behalf of Ireland Pay or Sponsor.
          </p>
          <p>
            2.2 Site Inspections. Sales Agent will take all action necessary to verify that each prospective Merchant conducts a bona fide business operation, including but not limited to inspecting the Merchant's premises to determine whether Merchant has the proper facilities, equipment, inventory and license or permit, if necessary, to conduct its business.
          </p>
          <p>
            2.3 Non-Solicitation. During the term of this Agreement and for the later of 5 years after termination of this Agreement or termination of any Merchant Agreement, neither Sales Agent, nor any sales agent, nor any principal, shareholder, member, director, officer, employee, agent or nominee, member of their immediate families, or affiliate of Sales Agent will directly or indirectly: (A) solicit or endeavor to obtain any Ireland Pay employee, independent contractor, consultant, independent sales organization or sales agent to work for any third party or contract directly with Sales Agent; or (B) solicit for itself or for any third party or contract with any Merchant for any product or service that is similar to any service offered by Ireland Pay or attempt to convert any Merchant to any other entity performing services similar to those offered by Ireland Pay. The parties understand and agree that any violation of this Section 2.3 would cause irreparable harm to Ireland Pay, that the damages associated with such violation would be difficult to calculate, and therefore, that, upon evidence that Sales Agent has violated Section 2.3(B), Sales Agent shall owe and shall immediately pay Ireland Pay forty-eight (48) times the average lost monthly residual received by Ireland Pay for such Merchant as liquidated damages and not as a penalty, as payment in full, which is the parties reasonable estimate of fair compensation for the foreseeable losses that might result from the breach. In addition, all Residuals will cease upon any breach ofthis Section.
          </p>
          <p>
            2.5 Background Check. Sales Agent and Sales Agent's principals authorize Ireland Pay to conduct and will submit to background and credit checks as deemed appropriate by Ireland Pay or Sponsor. Sale Agent will conduct and submit to Ireland Pay a background check on all ofits sales agents.
          </p>

          <p>2.6 Names and Trademarks.</p>
          <p>
            Ireland Pay Name and Trademark. Ireland Pay owns all right, title, and interest in and to the Ireland Pay name and trademark. Ireland Pay grants to Sales Agent a limited, revocable, non-exclusive license to use the name "Ireland Pay" and to use its trademark for the purposes of performing Sales Agent's obligations under this Agreement. Sales Agent will not attempt to register Ireland Pay's mark or any confusingly similar mark. All uses of the Ireland Pay name or trademark shall inure to the benefit of Ireland Pay. This Agreement confers, and Sales Agent shall obtain, no other right to Ireland Pay's name or trademark by virtue of such use. Sales Agent shall not register, adopt or use any work or mark which is confusingly similar to the Ireland Pay name or trademark. Sales Agent shall not use a d/b/a or register with any jurisdiction whatsoever any name which includes the Ireland Pay name or a name which is confusingly similar to the Ireland Pay name or trademark. A breach of this Section shall be deemed a breach of a material obligation under this Agreement.
          </p>
          <p>
            Termination of Use. Upon termination of this Agreement: (i) the limited rights granted to Sales Agent to use the Ireland Pay name and trademark shall immediately terminate; (ii) Sales Agent shall deliver to Ireland Pay or destroy all material upon which the Ireland Pay name or trademark appears; and(iii) Sales Agent shall take all actions necessary to correct information that suggests that Sales Agent is connected with Ireland Pay or that it has any right whatsoever to use the Ireland Pay name or trademark or any confusingly similar mark, including but not limited to deleting Ireland Pay's name or trademark from any Sales Agent web site.
          </p>

          <p>
            2.7 Merchant Fees. Sales Agent will recommend the amount of initial fees charged to Merchants subject to Ireland Pay's approval. Sales Agent will not impose any fee other than those set forth on the Merchant application. Sales Agent will not increase or decrease any fee without prior written consent from Ireland Pay. Sales Agent will not enter into any agreement or perform any services for a Merchant similar to the Services other than pursuant to this Agreement.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">III. Ireland Pay Responsibilities</h2>
          <p>
            3.1 Ireland Pay Responsibilities. Ireland Pay will evaluate all applications and approve or deny, within its sole discretion, the participation of a prospective Merchant in the Merchant Program in accordance with Ireland Pay's policies, which may be amended by Ireland Pay at any time. Ireland Pay will supply the form of Merchant Agreement and will define the conditions upon which Ireland Pay will provide Services to Merchants.
          </p>
          <p>
            3.2 Losses. All Losses that are passed through to Ireland Pay by Sponsor shall be a pass through expense deducted from Net Profits (as defined on Schedule A). In addition to the foregoing, Sales Agent will be liable for all Losses arising out of Sales Agent's negligence, fraud, willful misconduct or breach of this Agreement. Sales Agent will notify Ireland Pay immediately of any information concerning any Merchant that would indicate that a Loss may be incurred. Sales Agent will assist Ireland Pay in the course of claiming and collecting Losses.
          </p>
          <p>
            3.3 Ownership of Merchants. The parties understand and agree that all right, title and interest in all Merchant Agreements and Merchant relationships is owned by Ireland Pay.
          </p>
          <p>
            3.4 Residual Sales - Ireland Pay may negotiate, at its sole discretion, on behalf of Sales Agent to retain residuals prior to any sale or acquisition. Upon agreement in writing between Ireland Pay and Sales Agent, Sales Agent shall have the option to sell or retain residual payouts. Before any sale of residuals is completed, Ireland Pay shall offer Sales Agent a fair market value multiple, if Sales Agent is eligible.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">IV. Payments to Sales Agent</h2>
          <p>
            4.1 Residuals. Ireland Pay will pay Sales Agent the Residuals, as calculated pursuant to Schedule A. Schedule A may be amended from time to time by lreland Pay upon written notice to Sales Agent. Residuals shall be paid within 30 days after the end of the month in which Residuals are earned, provided Ireland Pay receives its corresponding payment from Sponsor, other Ireland Pay vendor and/or Merchant. Notwithstanding the foregoing, if the Residuals earned by Sales Agent are in excess of the amounts owed to Ireland Pay under this Agreement or any other agreement between the parties, Ireland Pay shall remit such excess amounts to Sales Agent, if the Residuals are less than the amount owed to Ireland Pay in any month ("Shortfall"), Sales Agent shall remit the Shortfall to Ireland Pay by the last day of the month in which the Shortfall occurred. At the time of each payment, Ireland Pay will deliver to Sales Agent a
          </p>
          <p>
            statement detailing the computations used by Ireland Pay in arriving at the Residual payment. Sales Agent will promptly examine all such statements and will notify Ireland Pay in writing within 45 days of any error. Unless Ireland Pay is notified of an error within 45 days, Ireland Pay shall not be liable to adjust the amount of Residuals paid. Sales Agent authorizes Ireland Pay to set off against Residuals any amount owed by Sales Agent under this Agreement or otherwise to Ireland Pay or Sponsor, including but not limited to Losses, overpayments of Residuals, amounts owed pursuant to Section 2.3 and indemnification amounts.
          </p>
          <p>
            4.2 Ongoing Payment of Residuals. Sales Agent shall be entitled to receive Residuals until: (A) an Event of Default caused by Sales Agent occurs; or (B) Ireland Pay no longer derives revenue from a particular Merchant; or (C) the Residuals in any one month are less than $500.00; or (D) Sales Agent fails to submit twelve (12) Merchants in any consecutive three (3) month period.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">V. Third Party Requirements</h2>
          <p>5.1 Visa/MasterCard Requirements.</p>
          <p>
            A. Sales Locations. Sales Agent has disclosed to Ireland Pay on the attached Schedule B the identity and location of all of its sales locations. Schedule B will be revised and submitted to Ireland Pay prior to any change in the identity or location of any of its sales locations. Sales Agent will not delegate any of its rights or obligations under this Agreement to any other person or entity except to the extent that Sales Agent has offices that sell the Services offered by Ireland Pay.
          </p>
          <p>
            B. Rules. In the event of any inconsistency between this Agreement and any Rules, the Rules will apply. Sales Agent acknowledges that it has received and understood, and that it agrees to comply with the Rules, including but not limited to Visa's Cardholder Information Security Program, MasterCard's Site Data Protection program requirements, and with the PCI Security Standards Council, LLC's Payment Card Industry Data Security Standards. AH fines or fees imposed upon Ireland Pay due to noncompliance by Sales Agent with any Rule shall be set off from Residual payments. If such fines or fees exceed the amount of Residuals in any one month, Sales Agent will reimburse Ireland Pay within 5 days of Ireland Pay's written demand for such amounts.
          </p>
          <p>
            C. Disclosures. All Merchant fees must be clearly and conspicuously disclosed to the Merchant in writing on the Merchant application prior to any payment or application. Upon request, Sales Agent will provide records containing Merchant information to Ireland Pay, Sponsor, any Card Organization, or any regulatory agency as soon as possible but no later than 5 days from Sales Agent's receipt of a request for such information.
          </p>
          <p>
            D. Card Organization Rights. Sales Agent agrees that each Card Organization has the right, either in law or in equity, to enforce any provision of the Rules and to prohibit Sales Agent's conduct that creates a risk of injury to such Card Organization or that may adversely affect the integrity of any Card Organization system, information, or both. Sales Agent will refrain from taking any action that would have the effect of interfering with or preventing an exercise of such right by any Card Organization.
          </p>
          <p>
            E. Sponsor Contact. Sales Agent must promptly volunteer a name or title of and a telephone number for an employee of Sponsor upon request of a Merchant or if the Sales Agent is unable or unwilling to respond to a Merchant question.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">VI. Mutual Obligations</h2>
          <p>
            6.1 Representations and Warranties. The parties represent and warrant that on the Effective Date and throughout the Initial Term or any Renewal Term of this Agreement:
          </p>
          <p>
            A. Good Standing. Each party is a corporation, limited liability company, partnership or sole proprietor organized, validly existing and in good standing under the laws of the state where its principal office is located. Each party bas full authority and corporate power to enter into this Agreement and to perform its obligations under this Agreement. This Agreement represents a valid obligation of that party and is fully enforceable against it.
          </p>
          <p>
            B. Sale of Information. Sales Agent will not sell, purchase, provide or exchange Credit Card or Debit Card account numbers, or any other Confidential Information, to any third party without the prior written consent of Ireland Pay.
          </p>
          <p>
            C. No Violation or Litigation. Neither party's performance of this Agreement will violate any third party's intellectual property rights, any applicable law or regulation or any agreement to which that party may now or hereafter be bound. Neither party nor its officers and directors are a party to any pending litigation that would have an impact on this Agreement.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">VII. Confidentiality</h2>
          <p>
            7.1 Information. Sales Agent agrees that it will not use for any purpose other than as necessary to carry out its obligations under this Agreement, will not disclose to any third party, and will retain in strictest confidence all Confidential Information and that Sales Agent will safeguard such Confidential Information by using the same degree of care and discretion that it uses to protect its own Confidential Information. Sales Agent will not be obligated to maintain the confidentiality of Confidential Information: (A) it is required to reveal in performing its obligations under this Agreement; (B) that is or becomes within the public domain through no act of Sales Agent in breach of this Agreement; (C) that was in the possession of Sales Agent prior to its disclosure under this Agreement, and Sales Agent can prove that; or (D) that is required to be disclosed by state or federal law, provided, however, that Sales Agent shall promptly inform Ireland Pay of the operation of this Section 7. l(D) to enable Ireland Pay to defend nondisclosure of its Confidential Information. Ireland Pay shall have the right to inspect Sales Agent's premises to ensure that Confidential Information is properly protected from disclosure, damage or theft.
          </p>
          <p>
            7.2 Remedy. In the event of a breach of this Section, the parties agree that Ireland Pay will suffer irreparable harm, and that the amount of monetary damages would be impossible to calculate. Thus, Ireland Pay will be entitled to injunctive relief in addition to any other rights to which Ireland Pay may be entitled as decided by a court of competent jurisdiction.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">VIII. Term, Termination, Default</h2>
          <p>
            8.1 Term. This Agreement will become effective on the Effective Date, and will remain in effect for a period of three (3) years from the Effective Date ("Initial Term"). This Agreement will automatically renew for one (1) year periods (each a "Renewal Term") unless terminated earlier in accordance with the provisions of this Agreement.
          </p>
          <p>8.2 Termination. Notwithstanding the above, the parties will have the following rights.</p>
          <p>
            A. Termination Without Cause. Either party may terminate this Agreement at the end of the initial Term or any Renewal Term upon written notice to the other party at least ninety (90) days prior to the end of the Initial Term or any Renewal Term.
          </p>
          <p>
            B. Termination For Cause. Any party may terminate this Agreement upon the occurrence of an Event of Default by the other party.
          </p>
          <p>
            C. Termination Due to Changes in Laws or Sponsorship. Ireland Pay may terminate this Agreement if it becomes impossible or impractical for Ireland Pay to perform its obligations under this Agreement by reason of changes in federal, state or local laws, or the Rules which this Agreement cannot reasonably be modified to accommodate. Ireland Pay may terminate this agreement if its agreement with its Sponsor terminates.
          </p>
          <p>8.3 Events of Default. Each ofthe following will constitute an Event of Default:</p>
          <p>
            A. False Representation. Any representation or warranty made by Sales Agent that proves to have been false or misleading in any material respect as of the date made, or becomes false or misleading at any time, including representations regarding a prospective Merchant.
          </p>
          <p>
            B. Breach. The other party fails to observe any material obligation specified in this Agreement and such failure is not cured within 30 days of receipt of written notice from the non-breaching party or immediately upon written notice to Sales Agent due to its breach of Sections 2.3, 4.2 or 7.1.
          </p>
          <p>
            C. Sales Agent Action. Sales Agent: (i) knowingly engages in activities which violate federal or state laws or regulations or the Rules or which cause Ireland Pay to violate the same; (ii) operates in an unsound, unsafe manner, including but not limited to committing a felony, fraud, or act of misconduct; (iii) engages in activities which may impose financial risk to Ireland Pay or which result in undue economic hardship and/or damage to the goodwill of Ireland Pay; or (iv) engages in activities that would cause Ireland Pay to violate or breach its agreement with Sponsor.
          </p>
          <p>
            D. Financial Instability. Sales Agent: (i) files for bankruptcy, receivership, insolvency, reorganization, dissolution, liquidation or any similar proceeding; (ii) has a bankruptcy, receivership, insolvency, reorganization, dissolution, or liquidation proceeding instituted against it and such proceeding is not dismissed within 60 days; (iii) makes an assignment for the benefit of its creditors or an offer of settlement, extension or composition to its creditors generally; or (iv) a trustee, conservator, receiver or similar fiduciary is appointed for that party or substantially all of that party's assets.
          </p>
          <p>
            E. Goodwill. Sales Agent engages in any act or omission that may damage the reputation, business or goodwill of lreland Pay.
          </p>
          <p>
            8.4 Certain Post-Termination Rights. Upon termination of this Agreement, Sales Agent will promptly discontinue its promotion of the Merchant Program. No termination of this Agreement will affect: (A) any Merchant Agreement in effect as of the date of termination; or (B) any right of Ireland Pay with regard to the collection of fees from Sales Agent or any amounts owed to Ireland Pay. Sales Agent will fully cooperate with Ireland Pay throughout the remaining term of each Merchant Agreement. Sales Agent will not directly or indirectly solicit any Merchant to terminate a Merchant Agreement for any reason after termination of this Agreement.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">IX. Indemnification and Limitation of Liability</h2>
          <p>9.1 Indemnification.</p>
          <p>
            A. Indemnity. Each party agrees to indemnify, defend, and hold harmless the other party, its employees, directors, managers, members, shareholders, or officers from and against any loss, liability, damage, penalty or expense (including reasonable attorneys' fees and court costs) ("Claim") which may be claimed by a third party as a result of: (i) any failure by the other party or any employee or affiliate of the party to comply with the terms of this Agreement; (ii) any warranty or representation made by the other party being false or misleading; (iii) any negligent act, fraud or willful misconduct of the party or its subcontractors, sales agents or employees; (iv) any alleged or actual violations by the other party or its subcontractors, employees, or sales agent ofany Rule or state or federal laws or regulations; or (v) a claim by a third party that the other party has violated such third party's intellectual property rights.
          </p>
          <p>
            B. Procedure. An indemnified party shall provide the indemnifying party: (i) reasonably prompt written notice of the existence of a Claim; (ii) control over the defense or settlement of any such Claim, provided that the indemnifying party shall not settle such Claim without the other party's prior written consent, which consent shall not be unreasonably withheld, and provided that the indemnified party shall have the right to participate in the defense of any such Claim at its expense and through counsel of its choosing; and (iii) non-financial assistance at the indemnifying party's request to the extent reasonably necessary for the defense of any such Claim. A failure to comply with this Section 9.1.B shall only affect the indemnifying party's obligations to the extent such failure materially prejudices the ability to reduce the expenses that may be owed, or to defend a Claim under this Section 9.1.
          </p>
          <p>
            9.2 Limitation of Liability. The liability, if any, of Ireland Pay under this Agreement for any claims, costs, damages, losses and expenses for which it is or may be legally liable, whether arising in negligence or other tort, contract, or otherwise, will not exceed in the aggregate the amount of any Residuals paid to Sales Agent for the preceding 3 month period, measured from the date the liability accrues. In no event will either party be liable for indirect, special, or consequential damages even if advised of that possibility.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">X. General</h2>
          <p>
            10.1 Assignability. Sales Agent may not transfer, sell, or otherwise assign any of its rights under this Agreement; either directly or by operation of law, without the prior written consent of Ireland Pay and any unauthorized attempted assignment will be null and void. If Sales Agent enters into an agreement to merge or transfer, assign or sell more than 20% of its equity interest without Ireland Pay's written consent, Ireland Pay will have the right to terminate this Agreement immediately.
          </p>
          <p>
            10.2 Notice. All communications under this Agreement will be in writing and will be delivered in person by email or by mail courier, return receipt requested, addressed to Ireland Pay or to Sales Agent at the address specified in the opening paragraph of this Agreement and to the attention of that party's manager or president. The parties may, from time to time, designate different persons or addresses to which subsequent communications will be sent by sending a notice of such designations in accordance with this Section. Failure to designate different persons or addresses to which subsequent communications will be sent shall not limit either party's rights under this Agreement to notify the other party at any address or location then known to the notifying party.
          </p>
          <p>
            10.3 Entire Understanding, Amendment. This Agreement, including the attached Schedules which are incorporated by reference, sets forth the entire understanding of the parties relating to its subject matter.
          </p>
          <p>
            Except as otherwise provided in this Agreement, this Agreement may not be amended except in a writing executed by both parties.
          </p>
          <p>
            10.4 Severability. If any provision of this Agreement is illegal, the invalidity of such provision will not affect any of the remaining provisions, and this Agreement will be construed as if the illegal provision is not contained in the Agreement. This Agreement will be deemed modified to the extent necessary to render enforceable the provisions hereunder.
          </p>
          <p>
            10.5 No Waiver of Rights. No failure or delay on the part of any party in exercising any right under this Agreement will operate as a waiver of that right, nor will any single or partial exercise of any right preclude any further exercise of that right.
          </p>
          <p>
            10.6 Successors and Assigns. This Agreement will inure to the benefit of and will be binding upon the parties and their respective permitted successors and assigns. This Agreement will not be deemed to be for the benefit of any third party.
          </p>
          <p>
            10.7 Applicable Law/Venue. The Agreement will be deemed to be a contract made under the laws of the State of Florida, and will be construed in accordance with the laws of Florida without regard to principles of conflicts of law. The exclusive forum and venue for the adjudication of any rights, claims or disputes arising out of or in connection with this Agreement shall be the federal or state courts of Miami-Dade County, Florida. The parties specifically waive the right to a jury trial in connection with any dispute arising out of this Agreement, or between the parties for any reason.
          </p>
          <p>
            10.8 Independent Contractors. Ireland Pay and Sales Agent will be deemed to be independent contractors and will not be considered to be Sales Agent, servant, joint venturer, or partner of the other. Ireland Pay will not be obligated to withhold from Sales Agent's Residuals any amounts for federal, state, social security, unemployment, or any other taxes required to be withheld as if Sales Agent were an employee of lreland Pay. All expenses and tax liabilities resulting from Sales Agent's performance under this Agreement will be Sales Agent's sole responsibility, including workers compensation insurance under applicable law. Sales Agent agrees to pay such taxes timely and to report the revenue derived from this Agreement in a manner consistent with the independent contractor relationship set forth in this Agreement. Sales Agent is not eligible to participate in any "fringe benefit" plans of Ireland Pay. Sales Agent will not represent or imply to any person that it is authorized to act as an agent or employee of lreland Pay. Sales Agent will not have any authority to bind or act on behalf of Ireland Pay, and Sales Agent will be responsible for providing all materials and tools required for the performance of the services.
          </p>
          <p>
            10.9 Construction. The headings used in this Agreement are inserted for convenience only and will not affect the interpretation of any provision. All Sections mentioned in the Agreement reference Section numbers of this Agreement. The language used will be deemed to be the language chosen by the parties to express their mutual intent, and no rule of strict construction will be applied against any party.
          </p>
          <p>
            10.10 Force Majeure. Neither party will be liable to the other for any failure or delay in its performance of this agreement in accordance with its terms if such failure or delay arises out of causes beyond the control and without the fault or negligence ofsuch party.
          </p>
          <p>
            10.11 Survival. All agreements that by their context are intended to survive the termination of this Agreement, including but not limited to Section 2.3, 3.2, 3.3, 4.1, 4.2, Article VII, Section 8.4, Article IX and Article X will survive termination of this Agreement
          </p>
          <p>
            10.12 Attorney's Fees. If any court holds that a party has breached this Agreement, then the non- defaulting party will be entitled to recover expenses incurred in enforcing the provisions of this Agreement, including reasonable attorneys' fees and costs.
          </p>
          <p>
            10.13 Remedies Cumulative. The remedies provided in this Agreement are cumulative and not exclusive, and Ireland Pay may exercise any remedies available to it at law or in equity and as are provided in this Agreement.
          </p>
          <p>
            10.14 Counterparts/Signatures/Electronic Execution. This Agreement may be executed in one or more counterparts, each of which shall be deemed an original and all of which together shall constitute one and the same instrument. Execution and delivery of a counterpart by electronic means—including, without limitation, via PDF, .jpg, .png, or through a secure website or electronic signature platform (e.g., DocuSign, Adobe Sign, or similar)—shall have the same legal force and effect as an original "wet‐ink" signature. Each Party hereby agrees that its electronic signature on any counterpart shall be binding and admissible in evidence to the same extent as an original signature.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Signatures</h2>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="font-semibold mb-4">WLJ Innovations, LLC DBA Ireland Pay</p>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Signature:</p>
                  <div className="border-b border-gray-300 h-8"></div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Print Name:</p>
                  <div className="border-b border-gray-300 h-8"></div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Position:</p>
                  <div className="border-b border-gray-300 h-8"></div>
                </div>
              </div>
            </div>
            <div>
              <p className="font-semibold mb-4">Sales Agent</p>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Signature:</p>
                  <div className="border-b border-gray-300 h-8"></div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Print Name:</p>
                  <div className="border-b border-gray-300 h-8"></div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Position:</p>
                  <div className="border-b border-gray-300 h-8"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Schedule B - Sales Offices and Sales Agents</h2>
          <div className="space-y-8">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border p-2 text-left">Sales Office Name</th>
                  <th className="border p-2 text-left">Address</th>
                  <th className="border p-2 text-left">Phone Number</th>
                </tr>
              </thead>
              <tbody>
                {[...Array(5)].map((_, i) => (
                  <tr key={i}>
                    <td className="border p-2">
                      <input
                        type="text"
                        className="w-full p-1 bg-transparent"
                        value={formData.schedule_b?.offices?.[i]?.name || ''}
                        onChange={(e) => handleTableChange('offices', i, 'name', e.target.value)}
                      />
                    </td>
                    <td className="border p-2">
                      <input
                        type="text"
                        className="w-full p-1 bg-transparent"
                        value={formData.schedule_b?.offices?.[i]?.address || ''}
                        onChange={(e) => handleTableChange('offices', i, 'address', e.target.value)}
                      />
                    </td>
                    <td className="border p-2">
                      <input
                        type="tel"
                        className="w-full p-1 bg-transparent"
                        value={formData.schedule_b?.offices?.[i]?.phone || ''}
                        onChange={(e) => handleTableChange('offices', i, 'phone', e.target.value)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border p-2 text-left">Sales Agent Name</th>
                  <th className="border p-2 text-left">Address</th>
                  <th className="border p-2 text-left">Social Security Number</th>
                </tr>
              </thead>
              <tbody>
                {[...Array(5)].map((_, i) => (
                  <tr key={i}>
                    <td className="border p-2">
                      <input
                        type="text"
                        className="w-full p-1 bg-transparent"
                        value={formData.schedule_b?.agents?.[i]?.name || ''}
                        onChange={(e) => handleTableChange('agents', i, 'name', e.target.value)}
                      />
                    </td>
                    <td className="border p-2">
                      <input
                        type="text"
                        className="w-full p-1 bg-transparent"
                        value={formData.schedule_b?.agents?.[i]?.address || ''}
                        onChange={(e) => handleTableChange('agents', i, 'address', e.target.value)}
                      />
                    </td>
                    <td className="border p-2">
                      <input
                        type="text"
                        className="w-full p-1 bg-transparent"
                        value={formData.schedule_b?.agents?.[i]?.ssn || ''}
                        onChange={(e) => handleTableChange('agents', i, 'ssn', e.target.value)}
                        placeholder="XXX-XX-XXXX"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </ScrollArea>
  );
}
