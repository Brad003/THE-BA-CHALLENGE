# Security Specification & Test-Driven Hardening

## 1. Data Invariants
1. **Identity Integrity**: A user can only write to their own profile `/users/{userId}` where `userId == request.auth.uid`.
2. **Post Authorship**: A community post can only be created if `incoming().authorId == request.auth.uid`.
3. **Sub-Collection Isolation**: An activity log in `/users/{userId}/activities/{activityId}` must match the parent document ID `userId == request.auth.uid`.
4. **Admin Privilege Guard**: Standard users cannot modify RBAC roles (e.g., promote themselves to `admin` or `coach`). Admin features are protected by admin verification (`madahanabrad@gmail.com` with `email_verified == true` or `/admins/{uid}`).
5. **Timestamp Immutability**: `createdAt` timestamps cannot be altered after creation (`incoming().createdAt == existing().createdAt`).
6. **Volumetric Boundaries**: String fields must adhere strictly to length limits (e.g., post content <= 2000 chars, IDs <= 128 chars).

---

## 2. The "Dirty Dozen" Malicious Payloads

1. **Payload 1 (Identity Spoofing on User Profile)**:
   - Attempt: Attacker (`uid_attacker`) attempts to overwrite `/users/uid_victim`.
   - Result: `PERMISSION_DENIED`.

2. **Payload 2 (Ghost Field / Shadow Update)**:
   - Attempt: User attempts to update profile with unauthorized administrative fields like `{ role: 'admin', isMasterCoach: true }`.
   - Result: `PERMISSION_DENIED`.

3. **Payload 3 (Spoofed Post Authorship)**:
   - Attempt: Authenticated user `uid_attacker` sends post with `{ authorId: 'uid_victim', content: 'Malicious post' }`.
   - Result: `PERMISSION_DENIED`.

4. **Payload 4 (Post ID Injection Attack)**:
   - Attempt: Attempting to create a post with an ID exceeding 128 characters or containing illegal characters.
   - Result: `PERMISSION_DENIED`.

5. **Payload 5 (Denial of Wallet - Massive Content Payload)**:
   - Attempt: Sending a post with `content` string exceeding 2000 characters.
   - Result: `PERMISSION_DENIED`.

6. **Payload 6 (Unauthorized Event Creation)**:
   - Attempt: Non-admin member attempts to publish or delete an official BA Event in `/events/{eventId}`.
   - Result: `PERMISSION_DENIED`.

7. **Payload 7 (Orphaned Sub-Collection Write)**:
   - Attempt: Attacker writes activity log into `/users/anotherUser/activities/act1`.
   - Result: `PERMISSION_DENIED`.

8. **Payload 8 (Negative Metric Injection)**:
   - Attempt: User writes `{ xp: -50000, pantherLevel: -1 }` or sets invalid negative values.
   - Result: `PERMISSION_DENIED`.

9. **Payload 9 (Unauthenticated Read of Private User Data)**:
   - Attempt: Anonymous or unauthenticated visitor attempts to list `/users`.
   - Result: `PERMISSION_DENIED`.

10. **Payload 10 (Event Capacity Tampering)**:
    - Attempt: Regular member attempts to modify `maxCapacity` or event metadata directly.
    - Result: `PERMISSION_DENIED`.

11. **Payload 11 (Email Verification Spoofing)**:
    - Attempt: Calling admin endpoints with an unverified email token.
    - Result: `PERMISSION_DENIED`.

12. **Payload 12 (Immutability Bypass)**:
    - Attempt: User modifies the `createdAt` timestamp of an existing post.
    - Result: `PERMISSION_DENIED`.

---

## 3. Test Runner Specification (`firestore.rules.test.ts`)
```typescript
import { assertFails, assertSucceeds } from '@firebase/rules-unit-testing';

// Test matrix ensuring all 12 dirty dozen payloads fail and legitimate operations pass.
```
