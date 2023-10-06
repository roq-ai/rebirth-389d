-- CreateTable
CREATE TABLE "general_practitioners" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "personal_phone" VARCHAR(255) NOT NULL,
    "office_phone" VARCHAR(255) NOT NULL,

    CONSTRAINT "general_practitioners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hospital" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "description" VARCHAR(255),
    "status" INTEGER DEFAULT 0,
    "name" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" UUID NOT NULL,
    "tenant_id" VARCHAR(255) NOT NULL,
    "address" VARCHAR(255),
    "city" VARCHAR(255),
    "identifier" VARCHAR(255),
    "postal_code" VARCHAR(255),
    "country" VARCHAR(255),
    "language" VARCHAR(255),

    CONSTRAINT "hospital_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hpc_decision_makings" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "hpc_meeting_id" UUID,
    "life_expectancy_without_cancer" VARCHAR(255) NOT NULL,
    "life_expectancy_untreated" VARCHAR(255) NOT NULL,
    "burden_cancer_untreated" VARCHAR(255) NOT NULL,
    "add_life_expectancy" VARCHAR(255) NOT NULL,

    CONSTRAINT "hpc_decision_makings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hpc_meeting_evaluations" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "treatment_information" VARCHAR(255) NOT NULL,
    "issues_since_last_review" VARCHAR(255) NOT NULL,
    "extra_support_needed" VARCHAR(255) NOT NULL,
    "treatment_plan_changed" BOOLEAN NOT NULL,
    "treatment_plan_changed_how" VARCHAR(255) NOT NULL,
    "treatment_plan_changed_other" VARCHAR(255),
    "treatmen_plan_changed_why" VARCHAR(255) NOT NULL,
    "how_successfull" VARCHAR(255) NOT NULL,
    "any_further_recommandations" VARCHAR(255) NOT NULL,
    "hpc_meeting_id" UUID,

    CONSTRAINT "hpc_meeting_evaluations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hpc_meeting_members" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" UUID,
    "hpc_meetings_id" UUID,

    CONSTRAINT "hpc_meeting_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hpc_meetings" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" INTEGER NOT NULL,
    "meeting_type" INTEGER NOT NULL,
    "date" TIMESTAMP(6) NOT NULL,
    "current_step" INTEGER,
    "number" INTEGER,
    "snapshot_id" VARCHAR(255),
    "patient_id" UUID,

    CONSTRAINT "hpc_meetings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "member_notifications" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notification_type" INTEGER NOT NULL,
    "read" BOOLEAN NOT NULL,
    "next_hpc_meeting_date" TIMESTAMP(6),
    "archived" BOOLEAN NOT NULL DEFAULT false,
    "patient_id" UUID,
    "member_id" UUID,

    CONSTRAINT "member_notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "new_tablepatient_treatments" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "patient_id" UUID,

    CONSTRAINT "new_tablepatient_treatments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patient" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" INTEGER NOT NULL,
    "status_date" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "status_reason" VARCHAR(255),
    "citizen_service_number" VARCHAR(255) NOT NULL,
    "first_name" VARCHAR(255) NOT NULL,
    "last_name" VARCHAR(255) NOT NULL,
    "gender" INTEGER NOT NULL,
    "birth_date" TIMESTAMP(6) NOT NULL,
    "phone_number" VARCHAR(255),
    "email" VARCHAR(255),
    "tour_done" BOOLEAN NOT NULL,
    "treatment_evaluation_done" BOOLEAN NOT NULL,
    "active_meeting" VARCHAR(255),
    "next_hpc_meeting" INTEGER NOT NULL,
    "next_hpc_date" TIMESTAMP(6),
    "follow_up_status" INTEGER NOT NULL,
    "assessed" BOOLEAN NOT NULL,
    "emergency_office_hour_number" VARCHAR(255),
    "emergency_outside_office_hour_number" VARCHAR(255),
    "living_situation" VARCHAR(255),
    "primary_caregiver" VARCHAR(255),
    "informal_care" VARCHAR(255),
    "formal_care" VARCHAR(255),
    "hospital_id" UUID,
    "apn_member_id" UUID,
    "general_practitioner_id" UUID,

    CONSTRAINT "patient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patient_substance_use" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "substance_use" VARCHAR(255) NOT NULL,
    "patient_id" UUID,

    CONSTRAINT "patient_substance_use_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patient_symptom_report" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "patient_id" UUID NOT NULL,
    "mood" INTEGER NOT NULL,
    "streak" INTEGER NOT NULL,
    "any_severe" BOOLEAN NOT NULL,
    "any_other_symptoms" BOOLEAN NOT NULL,

    CONSTRAINT "patient_symptom_report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" VARCHAR(255) NOT NULL,
    "firstName" VARCHAR(255),
    "lastName" VARCHAR(255),
    "roq_user_id" VARCHAR(255) NOT NULL,
    "tenant_id" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- AddForeignKey
ALTER TABLE "hospital" ADD CONSTRAINT "hospital_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "hpc_decision_makings" ADD CONSTRAINT "hpc_decision_makings_hpc_meeting_id_fkey" FOREIGN KEY ("hpc_meeting_id") REFERENCES "hpc_meetings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "hpc_meeting_evaluations" ADD CONSTRAINT "hpc_meeting_evaluations_hpc_meeting_id_fkey" FOREIGN KEY ("hpc_meeting_id") REFERENCES "hpc_meetings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "hpc_meeting_members" ADD CONSTRAINT "hpc_meeting_members_hpc_meetings_id_fkey" FOREIGN KEY ("hpc_meetings_id") REFERENCES "hpc_meetings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "hpc_meeting_members" ADD CONSTRAINT "hpc_meeting_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "hpc_meetings" ADD CONSTRAINT "hpc_meetings_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patient"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "member_notifications" ADD CONSTRAINT "member_notifications_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "member_notifications" ADD CONSTRAINT "member_notifications_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patient"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "new_tablepatient_treatments" ADD CONSTRAINT "new_tablepatient_treatments_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patient"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "patient" ADD CONSTRAINT "patient_apn_member_id_fkey" FOREIGN KEY ("apn_member_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "patient" ADD CONSTRAINT "patient_general_practitioner_id_fkey" FOREIGN KEY ("general_practitioner_id") REFERENCES "general_practitioners"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "patient" ADD CONSTRAINT "patient_hospital_id_fkey" FOREIGN KEY ("hospital_id") REFERENCES "hospital"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "patient_substance_use" ADD CONSTRAINT "patient_substance_use_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patient"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "patient_symptom_report" ADD CONSTRAINT "patient_symptom_report_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patient"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

