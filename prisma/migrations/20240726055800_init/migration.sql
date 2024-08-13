-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "spotifyId" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Track" (
    "id" SERIAL NOT NULL,
    "spotifyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "artist" TEXT NOT NULL,
    "album" TEXT NOT NULL,
    "durationMs" INTEGER NOT NULL,
    "popularity" INTEGER NOT NULL,
    "previewUrl" TEXT,

    CONSTRAINT "Track_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AudioFeatures" (
    "id" SERIAL NOT NULL,
    "trackId" INTEGER NOT NULL,
    "tempo" DOUBLE PRECISION NOT NULL,
    "acousticness" DOUBLE PRECISION NOT NULL,
    "speechiness" DOUBLE PRECISION NOT NULL,
    "valence" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "AudioFeatures_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserSavedTrack" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "trackId" INTEGER NOT NULL,
    "addedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserSavedTrack_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_spotifyId_key" ON "User"("spotifyId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Track_spotifyId_key" ON "Track"("spotifyId");

-- CreateIndex
CREATE UNIQUE INDEX "AudioFeatures_trackId_key" ON "AudioFeatures"("trackId");

-- CreateIndex
CREATE UNIQUE INDEX "UserSavedTrack_userId_trackId_key" ON "UserSavedTrack"("userId", "trackId");

-- AddForeignKey
ALTER TABLE "AudioFeatures" ADD CONSTRAINT "AudioFeatures_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "Track"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSavedTrack" ADD CONSTRAINT "UserSavedTrack_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSavedTrack" ADD CONSTRAINT "UserSavedTrack_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "Track"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
