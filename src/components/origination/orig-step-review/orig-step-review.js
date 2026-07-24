define([], function () {
  function OrigStepReviewViewModel(context) {
    var p = context.properties ? context.properties.params : context;
    this.context                = p.context;
    this.selectedProduct        = p.selectedProduct;
    this.detailBranch           = p.detailBranch;
    this.sourceAccount          = p.sourceAccount;
    this.detailAmount           = p.detailAmount;
    this.detailTenure           = p.detailTenure;
    this.detailPurpose          = p.detailPurpose;
    this.maturityInstruction    = p.maturityInstruction;
    this.showRollover           = p.showRollover;
    this.rolloverAmount         = p.rolloverAmount;
    this.showPayTo              = p.showPayTo;
    this.payToMode              = p.payToMode;
    this.payToOwnAccount        = p.payToOwnAccount;
    this.payToInternalAccNo     = p.payToInternalAccNo;
    this.payToInternalAccHolder = p.payToInternalAccHolder;
    this.addNominee             = p.addNominee;
    this.nomineeName            = p.nomineeName;
    this.nomineeRelationship    = p.nomineeRelationship;
  }
  return OrigStepReviewViewModel;
});
