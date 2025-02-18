import { Schema, model, models } from "mongoose";

const prospectSchema = new Schema({
    lastName: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        enum: ["Mrs", "Mr", "Mrs/Mr"],
        required: false,
    },
    age: {
        type: String,
        required: false,
    },
    region: {
        type: String,
        required: false,
    },
    arrondissement: {
        type: String,
        required: false,
    },
    departement: {
        type: String,
        required: false,
    },
    address: {
        type: String,
        required: false,
    },
    zipCode: {
        type: String,
        required: false,
    },
    city: {
        type: String,
        required: false,
    },
    district: {
        type: String,
        required: false,
    },
    housing: {
        type: String,
        required: false,
        enum: ["house", "flat"],
    },
    phone1: {
        type: String,
    },
    phone2: {
        type: String,
    },
    mobile1: {
        type: String,
    },
    mobile2: {
        type: String,
    },
    calling: {
        type: Number,
        required: false,
    },
    calls: {
        type: Array,
        required: false,
        status: {
            type: String,
            required: false,
            enum: ["Oui", "Non", "Mort", ''],
        },
        date: {
            type: String,
            required: false,
        },
        texte: {
            type: Object,
            required: false,
            value: {
                type: String,
                required: false,
            },
            updateAt: {
                type: String,
                required: false,
            },
        },
        anwser: {
            type: Object,
            required: false,
            value: {
                type: String,
                required: false,
            },
            updateAt: {
                type: String,
                required: false,
            },
        },
        idUser: {
            type: String,
            required: false,
        },
    },
    erpReference: {
        type: String,
        required: false,
        enum: ["reunion", "france", ""]
    },
    domaine: {
        type: String,
        required: false,
        enum: ["SOLAR", "ISO", ""]
    },
    iris: {
        type: String,
        required: false,
    },
    thread: {
        type: String,
        required: false,
    },
    rdv: {
        type: Array,
        required: true,
        date: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            required: true,
            enum: ["Reporté", "Fait", "Annulé", "Signé", ''],
        },
        idUser: {
            type: String,
            required: false,
        },
        idAdvisor: {
            type: String,
            required: false,
        }
    },
    proprietaire: {
        type: String,
        required: false,
        enum: ["Oui", "Non", ""],
    },
    profession: {
        type: String,
        required: false,
    },
    houseAge: {
        type: String,
        required: false,
        enum: ["-2 ans", "+5 ans", "+15 ans", ""]
    },
    facture: {
        type: Object,
        required: false,
        price: {
            type: Number,
            required: false,
            enum: [-100, 100]
        },
        frequency: {
            type: String,
            required: false,
            enum: ["Mensuel", "Be-mensuel", ""]
        },
    },
    consumption: {
        type: Array,
        required: false,
    },
    roof: {
        type: String,
        required: false,
        enum: ["Tuile", "ardoise", "Tole", "autre", ""]
    }
})

async function validatePhoneNumber(phoneNumber: string): Promise<boolean> {
    if (phoneNumber === "") {
        return true;
    }
    const prospect = await Prospects.findOne({
        $or: [
            { phone1: phoneNumber },
            { phone2: phoneNumber },
            { mobile1: phoneNumber },
            { mobile2: phoneNumber },
        ],
    });

    return !prospect;
}

prospectSchema.pre("save", async function (next) {
    const prospect = this as any;

    if (this.isNew) {
        const areAllEmpty = prospect.phone1 === "" && prospect.phone2 === "" && prospect.mobile1 === "" && prospect.mobile2 === "";

        if (areAllEmpty) {
            return next(new Error("At least one phone number must be filled."));
        }

        if (prospect.lastName === "" && prospect.firstName === "") {
            return next(new Error("Last name or first name must be filled."));
        }

        const isPhone1Unique = await validatePhoneNumber(prospect.phone1);
        const isPhone2Unique = await validatePhoneNumber(prospect.phone2);
        const isMobile1Unique = await validatePhoneNumber(prospect.mobile1);
        const isMobile2Unique = await validatePhoneNumber(prospect.mobile2);

        if (!(isPhone1Unique && isPhone2Unique && isMobile1Unique && isMobile2Unique)) {
            return next(new Error("Phone numbers must be unique for phone1, phone2, mobile1, and mobile2."));
        }

        const uniquePhoneNumbers = Array.from(new Set([prospect.phone1, prospect.phone2, prospect.mobile1, prospect.mobile2]));

        prospect.phone1 = uniquePhoneNumbers[0];
        prospect.phone2 = uniquePhoneNumbers[1] || "";
        prospect.mobile1 = uniquePhoneNumbers[2] || "";
        prospect.mobile2 = uniquePhoneNumbers[3] || "";
    }

    next();
});

const Prospects = models.Prospects || model("Prospects", prospectSchema);

export default Prospects;
