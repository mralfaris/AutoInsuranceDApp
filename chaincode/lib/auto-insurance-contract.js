/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class AutoInsuranceContract extends Contract {

    async submitClaim(ctx, claimId, reporterName, reportLicNo, vehiclePlate, 
                      vehicleMake, vehicleModel, vehicleYear, 
                      accidentLong, accidentLat, claimAmount) {

        const claim = {
            claimId: claimId,
            reporterName: reporterName,
            reportLicNo: reportLicNo,
            vehiclePlate: vehiclePlate,
            vehicleMake: vehicleMake,
            vehicleModel: vehicleModel,
            vehicleYear: vehicleYear,
            location: { 
                accidentLong: accidentLong,
                accidentLat: accidentLat
            },
            claimAmount: claimAmount
        };

        await ctx.stub.putState(claimId, Buffer.from(JSON.stringify(claim)));
    }

    async updateClaim(ctx, claimId, status, assignee, amount) {
        
        const claimAsBytes = await ctx.stub.getState(claimId); 
        if (!claimAsBytes || claimAsBytes.length === 0) {
            throw new Error(`${claimId} does not exist`);
        }

        const claim = JSON.parse(claimAsBytes.toString());
        claim.status = status;
        (assignee) ? claim.assignee = assignee : claim.assignee = "";
        (amount) ? claim.amount = amount : claim.amount = "";
        claim.lastActionDate = new Date().getTime();
        
        await ctx.stub.putState(claimId, Buffer.from(JSON.stringify(claim)));
    }
}

module.exports = AutoInsuranceContract;
