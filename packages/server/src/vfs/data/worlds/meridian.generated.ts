/**
 * GENERATED FILE -- DO NOT EDIT BY HAND.
 *
 * Produced by scripts/generate-world.ts. To change the simulated world, edit
 * that script and re-run:  npm run gen:world --workspace @soc/server
 *
 * This file is committed on purpose: exercise answers depend on the exact
 * contents, so the logs must not change unless somebody intends them to.
 */

/** 2491 lines of authentication events for Sep 02. */
export const AUTH_LOG = `Sep 02 00:00:09 rmg-vpn-01 sshd[21419]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 00:00:11 rmg-vpn-01 sshd[21419]: Failed password for nagios from 10.20.9.40 port 46829 ssh2
Sep 02 00:03:02 rmg-vpn-01 sshd[22839]: Invalid user support from 203.0.113.201 port 33133
Sep 02 00:03:03 rmg-vpn-01 sshd[22839]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 00:03:03 rmg-vpn-01 sshd[22839]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.201
Sep 02 00:03:05 rmg-vpn-01 sshd[22839]: Failed password for invalid user support from 203.0.113.201 port 33133 ssh2
Sep 02 00:03:06 rmg-vpn-01 sshd[22839]: Connection closed by invalid user support 203.0.113.201 port 33133 [preauth]
Sep 02 00:05:04 rmg-vpn-01 sshd[21421]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 00:05:06 rmg-vpn-01 sshd[21421]: Failed password for nagios from 10.20.9.40 port 54358 ssh2
Sep 02 00:10:06 rmg-vpn-01 sshd[21424]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 00:10:08 rmg-vpn-01 sshd[21424]: Failed password for nagios from 10.20.9.40 port 59583 ssh2
Sep 02 00:15:15 rmg-vpn-01 sshd[21425]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 00:15:17 rmg-vpn-01 sshd[21425]: Failed password for nagios from 10.20.9.40 port 42412 ssh2
Sep 02 00:17:01 rmg-vpn-01 CRON[14689]: pam_unix(cron:session): session opened for user root(uid=0) by (uid=0)
Sep 02 00:17:01 rmg-vpn-01 CRON[20385]: pam_unix(cron:session): session closed for user root
Sep 02 00:20:23 rmg-vpn-01 sshd[21426]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 00:20:25 rmg-vpn-01 sshd[21426]: Failed password for nagios from 10.20.9.40 port 61381 ssh2
Sep 02 00:25:17 rmg-vpn-01 sshd[21431]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 00:25:19 rmg-vpn-01 sshd[21431]: Failed password for nagios from 10.20.9.40 port 51233 ssh2
Sep 02 00:29:19 rmg-vpn-01 sshd[22830]: Invalid user ubuntu from 192.0.2.171 port 47339
Sep 02 00:29:20 rmg-vpn-01 sshd[22830]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 00:29:20 rmg-vpn-01 sshd[22830]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=192.0.2.171
Sep 02 00:29:22 rmg-vpn-01 sshd[22830]: Failed password for invalid user ubuntu from 192.0.2.171 port 47339 ssh2
Sep 02 00:29:23 rmg-vpn-01 sshd[22830]: Connection closed by invalid user ubuntu 192.0.2.171 port 47339 [preauth]
Sep 02 00:30:27 rmg-vpn-01 sshd[21435]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 00:30:29 rmg-vpn-01 sshd[21435]: Failed password for nagios from 10.20.9.40 port 40579 ssh2
Sep 02 00:35:10 rmg-vpn-01 sshd[21441]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 00:35:12 rmg-vpn-01 sshd[21441]: Failed password for nagios from 10.20.9.40 port 33683 ssh2
Sep 02 00:40:21 rmg-vpn-01 sshd[21446]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 00:40:23 rmg-vpn-01 sshd[21446]: Failed password for nagios from 10.20.9.40 port 42842 ssh2
Sep 02 00:43:08 rmg-vpn-01 sshd[22845]: Invalid user admin from 192.0.2.171 port 31159
Sep 02 00:43:09 rmg-vpn-01 sshd[22845]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 00:43:09 rmg-vpn-01 sshd[22845]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=192.0.2.171
Sep 02 00:43:11 rmg-vpn-01 sshd[22845]: Failed password for invalid user admin from 192.0.2.171 port 31159 ssh2
Sep 02 00:43:12 rmg-vpn-01 sshd[22845]: Connection closed by invalid user admin 192.0.2.171 port 31159 [preauth]
Sep 02 00:45:30 rmg-vpn-01 sshd[21450]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 00:45:32 rmg-vpn-01 sshd[21450]: Failed password for nagios from 10.20.9.40 port 52367 ssh2
Sep 02 00:47:44 rmg-vpn-01 sshd[22836]: Invalid user webmaster from 198.51.100.23 port 51272
Sep 02 00:47:45 rmg-vpn-01 sshd[22836]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 00:47:45 rmg-vpn-01 sshd[22836]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.23
Sep 02 00:47:47 rmg-vpn-01 sshd[22836]: Failed password for invalid user webmaster from 198.51.100.23 port 51272 ssh2
Sep 02 00:47:48 rmg-vpn-01 sshd[22836]: Connection closed by invalid user webmaster 198.51.100.23 port 51272 [preauth]
Sep 02 00:50:00 rmg-vpn-01 sshd[22852]: Invalid user git from 203.0.113.140 port 41949
Sep 02 00:50:01 rmg-vpn-01 sshd[22852]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 00:50:01 rmg-vpn-01 sshd[22852]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.140
Sep 02 00:50:03 rmg-vpn-01 sshd[22852]: Failed password for invalid user git from 203.0.113.140 port 41949 ssh2
Sep 02 00:50:04 rmg-vpn-01 sshd[22852]: Connection closed by invalid user git 203.0.113.140 port 41949 [preauth]
Sep 02 00:50:05 rmg-vpn-01 sshd[21457]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 00:50:07 rmg-vpn-01 sshd[21457]: Failed password for nagios from 10.20.9.40 port 63216 ssh2
Sep 02 00:52:54 rmg-vpn-01 sshd[22832]: Invalid user mysql from 203.0.113.201 port 57328
Sep 02 00:52:55 rmg-vpn-01 sshd[22832]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 00:52:55 rmg-vpn-01 sshd[22832]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.201
Sep 02 00:52:57 rmg-vpn-01 sshd[22832]: Failed password for invalid user mysql from 203.0.113.201 port 57328 ssh2
Sep 02 00:52:58 rmg-vpn-01 sshd[22832]: Connection closed by invalid user mysql 203.0.113.201 port 57328 [preauth]
Sep 02 00:55:04 rmg-vpn-01 sshd[21466]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 00:55:06 rmg-vpn-01 sshd[21466]: Failed password for nagios from 10.20.9.40 port 62198 ssh2
Sep 02 00:57:10 rmg-vpn-01 sshd[22846]: Invalid user jenkins from 192.0.2.9 port 62837
Sep 02 00:57:11 rmg-vpn-01 sshd[22846]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 00:57:11 rmg-vpn-01 sshd[22846]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=192.0.2.9
Sep 02 00:57:13 rmg-vpn-01 sshd[22846]: Failed password for invalid user jenkins from 192.0.2.9 port 62837 ssh2
Sep 02 00:57:14 rmg-vpn-01 sshd[22846]: Connection closed by invalid user jenkins 192.0.2.9 port 62837 [preauth]
Sep 02 01:00:15 rmg-vpn-01 sshd[21467]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 01:00:17 rmg-vpn-01 sshd[21467]: Failed password for nagios from 10.20.9.40 port 60943 ssh2
Sep 02 01:02:31 rmg-vpn-01 sshd[22869]: Invalid user webmaster from 203.0.113.140 port 33735
Sep 02 01:02:32 rmg-vpn-01 sshd[22869]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 01:02:32 rmg-vpn-01 sshd[22869]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.140
Sep 02 01:02:34 rmg-vpn-01 sshd[22869]: Failed password for invalid user webmaster from 203.0.113.140 port 33735 ssh2
Sep 02 01:02:35 rmg-vpn-01 sshd[22869]: Connection closed by invalid user webmaster 203.0.113.140 port 33735 [preauth]
Sep 02 01:02:49 rmg-vpn-01 sshd[22862]: Invalid user mysql from 203.0.113.140 port 56509
Sep 02 01:02:50 rmg-vpn-01 sshd[22862]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 01:02:50 rmg-vpn-01 sshd[22862]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.140
Sep 02 01:02:52 rmg-vpn-01 sshd[22862]: Failed password for invalid user mysql from 203.0.113.140 port 56509 ssh2
Sep 02 01:02:53 rmg-vpn-01 sshd[22862]: Connection closed by invalid user mysql 203.0.113.140 port 56509 [preauth]
Sep 02 01:05:16 rmg-vpn-01 sshd[21473]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 01:05:18 rmg-vpn-01 sshd[21473]: Failed password for nagios from 10.20.9.40 port 39579 ssh2
Sep 02 01:10:20 rmg-vpn-01 sshd[21480]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 01:10:22 rmg-vpn-01 sshd[21480]: Failed password for nagios from 10.20.9.40 port 54316 ssh2
Sep 02 01:15:00 rmg-vpn-01 sshd[21483]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 01:15:02 rmg-vpn-01 sshd[21483]: Failed password for nagios from 10.20.9.40 port 47586 ssh2
Sep 02 01:17:01 rmg-vpn-01 CRON[25788]: pam_unix(cron:session): session opened for user root(uid=0) by (uid=0)
Sep 02 01:17:01 rmg-vpn-01 CRON[18596]: pam_unix(cron:session): session closed for user root
Sep 02 01:20:09 rmg-vpn-01 sshd[21487]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 01:20:11 rmg-vpn-01 sshd[21487]: Failed password for nagios from 10.20.9.40 port 52427 ssh2
Sep 02 01:25:12 rmg-vpn-01 sshd[21490]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 01:25:14 rmg-vpn-01 sshd[21490]: Failed password for nagios from 10.20.9.40 port 39813 ssh2
Sep 02 01:28:17 rmg-vpn-01 sshd[22872]: Invalid user ubuntu from 192.0.2.44 port 41354
Sep 02 01:28:18 rmg-vpn-01 sshd[22872]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 01:28:18 rmg-vpn-01 sshd[22872]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=192.0.2.44
Sep 02 01:28:20 rmg-vpn-01 sshd[22872]: Failed password for invalid user ubuntu from 192.0.2.44 port 41354 ssh2
Sep 02 01:28:21 rmg-vpn-01 sshd[22872]: Connection closed by invalid user ubuntu 192.0.2.44 port 41354 [preauth]
Sep 02 01:30:15 rmg-vpn-01 sshd[21404]: Accepted publickey for svc-backup from 10.20.9.15 port 31030 ssh2
Sep 02 01:30:16 rmg-vpn-01 sshd[21404]: pam_unix(sshd:session): session opened for user svc-backup(uid=1500) by (uid=0)
Sep 02 01:30:22 rmg-vpn-01 sshd[21491]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 01:30:24 rmg-vpn-01 sshd[21491]: Failed password for nagios from 10.20.9.40 port 53408 ssh2
Sep 02 01:34:48 rmg-vpn-01 sshd[21404]: pam_unix(sshd:session): session closed for user svc-backup
Sep 02 01:35:11 rmg-vpn-01 sshd[21495]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 01:35:13 rmg-vpn-01 sshd[21495]: Failed password for nagios from 10.20.9.40 port 54948 ssh2
Sep 02 01:40:22 rmg-vpn-01 sshd[21500]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 01:40:24 rmg-vpn-01 sshd[21500]: Failed password for nagios from 10.20.9.40 port 56444 ssh2
Sep 02 01:42:49 rmg-vpn-01 sshd[22878]: Invalid user guest from 198.51.100.23 port 41784
Sep 02 01:42:50 rmg-vpn-01 sshd[22878]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 01:42:50 rmg-vpn-01 sshd[22878]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.23
Sep 02 01:42:52 rmg-vpn-01 sshd[22878]: Failed password for invalid user guest from 198.51.100.23 port 41784 ssh2
Sep 02 01:42:53 rmg-vpn-01 sshd[22878]: Connection closed by invalid user guest 198.51.100.23 port 41784 [preauth]
Sep 02 01:45:06 rmg-vpn-01 sshd[21508]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 01:45:08 rmg-vpn-01 sshd[21508]: Failed password for nagios from 10.20.9.40 port 31098 ssh2
Sep 02 01:50:11 rmg-vpn-01 sshd[21517]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 01:50:13 rmg-vpn-01 sshd[21517]: Failed password for nagios from 10.20.9.40 port 38303 ssh2
Sep 02 01:50:52 rmg-vpn-01 sshd[22887]: Invalid user ftpuser from 198.51.100.202 port 60439
Sep 02 01:50:53 rmg-vpn-01 sshd[22887]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 01:50:53 rmg-vpn-01 sshd[22887]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.202
Sep 02 01:50:55 rmg-vpn-01 sshd[22887]: Failed password for invalid user ftpuser from 198.51.100.202 port 60439 ssh2
Sep 02 01:50:56 rmg-vpn-01 sshd[22887]: Connection closed by invalid user ftpuser 198.51.100.202 port 60439 [preauth]
Sep 02 01:55:26 rmg-vpn-01 sshd[21525]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 01:55:28 rmg-vpn-01 sshd[21525]: Failed password for nagios from 10.20.9.40 port 43498 ssh2
Sep 02 01:58:03 rmg-vpn-01 sshd[22861]: Invalid user user from 192.0.2.171 port 64092
Sep 02 01:58:04 rmg-vpn-01 sshd[22861]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 01:58:04 rmg-vpn-01 sshd[22861]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=192.0.2.171
Sep 02 01:58:06 rmg-vpn-01 sshd[22861]: Failed password for invalid user user from 192.0.2.171 port 64092 ssh2
Sep 02 01:58:07 rmg-vpn-01 sshd[22861]: Connection closed by invalid user user 192.0.2.171 port 64092 [preauth]
Sep 02 02:00:28 rmg-vpn-01 sshd[21533]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 02:00:30 rmg-vpn-01 sshd[21533]: Failed password for nagios from 10.20.9.40 port 33898 ssh2
Sep 02 02:05:06 rmg-vpn-01 sshd[21537]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 02:05:08 rmg-vpn-01 sshd[21537]: Failed password for nagios from 10.20.9.40 port 41759 ssh2
Sep 02 02:10:07 rmg-vpn-01 sshd[21543]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 02:10:09 rmg-vpn-01 sshd[21543]: Failed password for nagios from 10.20.9.40 port 50120 ssh2
Sep 02 02:15:20 rmg-vpn-01 sshd[21552]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 02:15:22 rmg-vpn-01 sshd[21552]: Failed password for nagios from 10.20.9.40 port 32022 ssh2
Sep 02 02:17:01 rmg-vpn-01 CRON[20241]: pam_unix(cron:session): session opened for user root(uid=0) by (uid=0)
Sep 02 02:17:01 rmg-vpn-01 CRON[19228]: pam_unix(cron:session): session closed for user root
Sep 02 02:18:12 rmg-vpn-01 sshd[22923]: Invalid user webmaster from 198.51.100.23 port 53385
Sep 02 02:18:13 rmg-vpn-01 sshd[22923]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 02:18:13 rmg-vpn-01 sshd[22923]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.23
Sep 02 02:18:15 rmg-vpn-01 sshd[22923]: Failed password for invalid user webmaster from 198.51.100.23 port 53385 ssh2
Sep 02 02:18:16 rmg-vpn-01 sshd[22923]: Connection closed by invalid user webmaster 198.51.100.23 port 53385 [preauth]
Sep 02 02:20:15 rmg-vpn-01 sshd[21557]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 02:20:17 rmg-vpn-01 sshd[21557]: Failed password for nagios from 10.20.9.40 port 40201 ssh2
Sep 02 02:21:08 rmg-vpn-01 sshd[22891]: Invalid user oracle from 203.0.113.201 port 59698
Sep 02 02:21:09 rmg-vpn-01 sshd[22891]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 02:21:09 rmg-vpn-01 sshd[22891]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.201
Sep 02 02:21:11 rmg-vpn-01 sshd[22891]: Failed password for invalid user oracle from 203.0.113.201 port 59698 ssh2
Sep 02 02:21:12 rmg-vpn-01 sshd[22891]: Connection closed by invalid user oracle 203.0.113.201 port 59698 [preauth]
Sep 02 02:22:23 rmg-vpn-01 sshd[22932]: Invalid user ftpuser from 192.0.2.44 port 57287
Sep 02 02:22:24 rmg-vpn-01 sshd[22932]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 02:22:24 rmg-vpn-01 sshd[22932]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=192.0.2.44
Sep 02 02:22:26 rmg-vpn-01 sshd[22932]: Failed password for invalid user ftpuser from 192.0.2.44 port 57287 ssh2
Sep 02 02:22:27 rmg-vpn-01 sshd[22932]: Connection closed by invalid user ftpuser 192.0.2.44 port 57287 [preauth]
Sep 02 02:23:36 rmg-vpn-01 sshd[22910]: Invalid user admin from 198.51.100.23 port 60689
Sep 02 02:23:37 rmg-vpn-01 sshd[22910]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 02:23:37 rmg-vpn-01 sshd[22910]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.23
Sep 02 02:23:39 rmg-vpn-01 sshd[22910]: Failed password for invalid user admin from 198.51.100.23 port 60689 ssh2
Sep 02 02:23:40 rmg-vpn-01 sshd[22910]: Connection closed by invalid user admin 198.51.100.23 port 60689 [preauth]
Sep 02 02:25:18 rmg-vpn-01 sshd[21562]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 02:25:20 rmg-vpn-01 sshd[21562]: Failed password for nagios from 10.20.9.40 port 44005 ssh2
Sep 02 02:27:01 rmg-vpn-01 sshd[22917]: Invalid user deploy from 192.0.2.44 port 36729
Sep 02 02:27:02 rmg-vpn-01 sshd[22917]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 02:27:02 rmg-vpn-01 sshd[22917]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=192.0.2.44
Sep 02 02:27:04 rmg-vpn-01 sshd[22917]: Failed password for invalid user deploy from 192.0.2.44 port 36729 ssh2
Sep 02 02:27:05 rmg-vpn-01 sshd[22917]: Connection closed by invalid user deploy 192.0.2.44 port 36729 [preauth]
Sep 02 02:30:10 rmg-vpn-01 sshd[21569]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 02:30:12 rmg-vpn-01 sshd[21569]: Failed password for nagios from 10.20.9.40 port 34529 ssh2
Sep 02 02:35:03 rmg-vpn-01 sshd[21577]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 02:35:05 rmg-vpn-01 sshd[21577]: Failed password for nagios from 10.20.9.40 port 42821 ssh2
Sep 02 02:40:21 rmg-vpn-01 sshd[21585]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 02:40:23 rmg-vpn-01 sshd[21585]: Failed password for nagios from 10.20.9.40 port 62377 ssh2
Sep 02 02:45:09 rmg-vpn-01 sshd[21586]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 02:45:11 rmg-vpn-01 sshd[21586]: Failed password for nagios from 10.20.9.40 port 55803 ssh2
Sep 02 02:49:40 rmg-vpn-01 sshd[22899]: Invalid user postgres from 192.0.2.44 port 53193
Sep 02 02:49:41 rmg-vpn-01 sshd[22899]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 02:49:41 rmg-vpn-01 sshd[22899]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=192.0.2.44
Sep 02 02:49:43 rmg-vpn-01 sshd[22899]: Failed password for invalid user postgres from 192.0.2.44 port 53193 ssh2
Sep 02 02:49:44 rmg-vpn-01 sshd[22899]: Connection closed by invalid user postgres 192.0.2.44 port 53193 [preauth]
Sep 02 02:50:28 rmg-vpn-01 sshd[21592]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 02:50:30 rmg-vpn-01 sshd[21592]: Failed password for nagios from 10.20.9.40 port 39485 ssh2
Sep 02 02:54:30 rmg-vpn-01 sshd[22903]: Invalid user mysql from 192.0.2.9 port 48457
Sep 02 02:54:31 rmg-vpn-01 sshd[22903]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 02:54:31 rmg-vpn-01 sshd[22903]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=192.0.2.9
Sep 02 02:54:33 rmg-vpn-01 sshd[22903]: Failed password for invalid user mysql from 192.0.2.9 port 48457 ssh2
Sep 02 02:54:34 rmg-vpn-01 sshd[22903]: Connection closed by invalid user mysql 192.0.2.9 port 48457 [preauth]
Sep 02 02:55:25 rmg-vpn-01 sshd[21597]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 02:55:27 rmg-vpn-01 sshd[21597]: Failed password for nagios from 10.20.9.40 port 58473 ssh2
Sep 02 03:00:30 rmg-vpn-01 sshd[21604]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 03:00:32 rmg-vpn-01 sshd[21604]: Failed password for nagios from 10.20.9.40 port 60042 ssh2
Sep 02 03:03:04 rmg-vpn-01 sshd[22940]: Invalid user mysql from 203.0.113.201 port 61058
Sep 02 03:03:05 rmg-vpn-01 sshd[22940]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 03:03:05 rmg-vpn-01 sshd[22940]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.201
Sep 02 03:03:07 rmg-vpn-01 sshd[22940]: Failed password for invalid user mysql from 203.0.113.201 port 61058 ssh2
Sep 02 03:03:08 rmg-vpn-01 sshd[22940]: Connection closed by invalid user mysql 203.0.113.201 port 61058 [preauth]
Sep 02 03:05:00 rmg-vpn-01 sshd[21613]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 03:05:02 rmg-vpn-01 sshd[21613]: Failed password for nagios from 10.20.9.40 port 58668 ssh2
Sep 02 03:10:30 rmg-vpn-01 sshd[21621]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 03:10:32 rmg-vpn-01 sshd[21621]: Failed password for nagios from 10.20.9.40 port 35629 ssh2
Sep 02 03:11:27 rmg-vpn-01 sshd[21411]: Accepted password for rchen from 10.20.4.12 port 50229 ssh2
Sep 02 03:11:28 rmg-vpn-01 sshd[21411]: pam_unix(sshd:session): session opened for user rchen(uid=1003) by (uid=0)
Sep 02 03:14:02 rmg-vpn-01 sudo:    rchen : TTY=pts/0 ; PWD=/home/rchen ; USER=root ; COMMAND=/usr/bin/systemctl restart postgresql
Sep 02 03:14:02 rmg-vpn-01 sudo: pam_unix(sudo:session): session opened for user root(uid=0) by rchen(uid=1003)
Sep 02 03:14:09 rmg-vpn-01 sudo: pam_unix(sudo:session): session closed for user root
Sep 02 03:15:28 rmg-vpn-01 sshd[21630]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 03:15:30 rmg-vpn-01 sshd[21630]: Failed password for nagios from 10.20.9.40 port 53408 ssh2
Sep 02 03:17:01 rmg-vpn-01 CRON[16449]: pam_unix(cron:session): session opened for user root(uid=0) by (uid=0)
Sep 02 03:17:01 rmg-vpn-01 CRON[22918]: pam_unix(cron:session): session closed for user root
Sep 02 03:20:14 rmg-vpn-01 sshd[21631]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 03:20:16 rmg-vpn-01 sshd[21631]: Failed password for nagios from 10.20.9.40 port 32446 ssh2
Sep 02 03:25:22 rmg-vpn-01 sshd[21636]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 03:25:24 rmg-vpn-01 sshd[21636]: Failed password for nagios from 10.20.9.40 port 36883 ssh2
Sep 02 03:30:24 rmg-vpn-01 sshd[21637]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 03:30:26 rmg-vpn-01 sshd[21637]: Failed password for nagios from 10.20.9.40 port 49585 ssh2
Sep 02 03:35:19 rmg-vpn-01 sshd[21643]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 03:35:21 rmg-vpn-01 sshd[21643]: Failed password for nagios from 10.20.9.40 port 52109 ssh2
Sep 02 03:40:12 rmg-vpn-01 sshd[21647]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 03:40:14 rmg-vpn-01 sshd[21647]: Failed password for nagios from 10.20.9.40 port 31420 ssh2
Sep 02 03:41:18 rmg-vpn-01 sshd[21411]: pam_unix(sshd:session): session closed for user rchen
Sep 02 03:43:05 rmg-vpn-01 sshd[22948]: Invalid user webmaster from 192.0.2.9 port 30129
Sep 02 03:43:06 rmg-vpn-01 sshd[22948]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 03:43:06 rmg-vpn-01 sshd[22948]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=192.0.2.9
Sep 02 03:43:08 rmg-vpn-01 sshd[22948]: Failed password for invalid user webmaster from 192.0.2.9 port 30129 ssh2
Sep 02 03:43:09 rmg-vpn-01 sshd[22948]: Connection closed by invalid user webmaster 192.0.2.9 port 30129 [preauth]
Sep 02 03:45:09 rmg-vpn-01 sshd[21656]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 03:45:11 rmg-vpn-01 sshd[21656]: Failed password for nagios from 10.20.9.40 port 34179 ssh2
Sep 02 03:50:03 rmg-vpn-01 sshd[21663]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 03:50:05 rmg-vpn-01 sshd[21663]: Failed password for nagios from 10.20.9.40 port 30782 ssh2
Sep 02 03:55:04 rmg-vpn-01 sshd[21665]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 03:55:06 rmg-vpn-01 sshd[21665]: Failed password for nagios from 10.20.9.40 port 37115 ssh2
Sep 02 03:55:59 rmg-vpn-01 sshd[22946]: Invalid user oracle from 192.0.2.9 port 47619
Sep 02 03:56:00 rmg-vpn-01 sshd[22946]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 03:56:00 rmg-vpn-01 sshd[22946]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=192.0.2.9
Sep 02 03:56:02 rmg-vpn-01 sshd[22946]: Failed password for invalid user oracle from 192.0.2.9 port 47619 ssh2
Sep 02 03:56:03 rmg-vpn-01 sshd[22946]: Connection closed by invalid user oracle 192.0.2.9 port 47619 [preauth]
Sep 02 04:00:02 rmg-vpn-01 sshd[21669]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 04:00:04 rmg-vpn-01 sshd[21669]: Failed password for nagios from 10.20.9.40 port 49991 ssh2
Sep 02 04:05:28 rmg-vpn-01 sshd[21678]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 04:05:30 rmg-vpn-01 sshd[21678]: Failed password for nagios from 10.20.9.40 port 43340 ssh2
Sep 02 04:10:26 rmg-vpn-01 sshd[21681]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 04:10:28 rmg-vpn-01 sshd[21681]: Failed password for nagios from 10.20.9.40 port 51391 ssh2
Sep 02 04:12:38 rmg-vpn-01 sshd[22964]: Invalid user postgres from 203.0.113.12 port 33008
Sep 02 04:12:39 rmg-vpn-01 sshd[22964]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 04:12:39 rmg-vpn-01 sshd[22964]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12
Sep 02 04:12:41 rmg-vpn-01 sshd[22964]: Failed password for invalid user postgres from 203.0.113.12 port 33008 ssh2
Sep 02 04:12:42 rmg-vpn-01 sshd[22964]: Connection closed by invalid user postgres 203.0.113.12 port 33008 [preauth]
Sep 02 04:15:13 rmg-vpn-01 sshd[21684]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 04:15:15 rmg-vpn-01 sshd[21684]: Failed password for nagios from 10.20.9.40 port 35128 ssh2
Sep 02 04:17:01 rmg-vpn-01 CRON[19638]: pam_unix(cron:session): session opened for user root(uid=0) by (uid=0)
Sep 02 04:17:01 rmg-vpn-01 CRON[10813]: pam_unix(cron:session): session closed for user root
Sep 02 04:20:13 rmg-vpn-01 sshd[21688]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 04:20:15 rmg-vpn-01 sshd[21688]: Failed password for nagios from 10.20.9.40 port 60112 ssh2
Sep 02 04:25:13 rmg-vpn-01 sshd[21691]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 04:25:15 rmg-vpn-01 sshd[21691]: Failed password for nagios from 10.20.9.40 port 61341 ssh2
Sep 02 04:30:23 rmg-vpn-01 sshd[21700]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 04:30:25 rmg-vpn-01 sshd[21700]: Failed password for nagios from 10.20.9.40 port 43970 ssh2
Sep 02 04:35:16 rmg-vpn-01 sshd[21703]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 04:35:18 rmg-vpn-01 sshd[21703]: Failed password for nagios from 10.20.9.40 port 34543 ssh2
Sep 02 04:40:26 rmg-vpn-01 sshd[21708]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 04:40:28 rmg-vpn-01 sshd[21708]: Failed password for nagios from 10.20.9.40 port 30910 ssh2
Sep 02 04:45:18 rmg-vpn-01 sshd[21709]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 04:45:20 rmg-vpn-01 sshd[21709]: Failed password for nagios from 10.20.9.40 port 58640 ssh2
Sep 02 04:45:48 rmg-vpn-01 sshd[22956]: Invalid user webmaster from 198.51.100.23 port 33016
Sep 02 04:45:49 rmg-vpn-01 sshd[22956]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 04:45:49 rmg-vpn-01 sshd[22956]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.23
Sep 02 04:45:51 rmg-vpn-01 sshd[22956]: Failed password for invalid user webmaster from 198.51.100.23 port 33016 ssh2
Sep 02 04:45:52 rmg-vpn-01 sshd[22956]: Connection closed by invalid user webmaster 198.51.100.23 port 33016 [preauth]
Sep 02 04:50:29 rmg-vpn-01 sshd[21718]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 04:50:31 rmg-vpn-01 sshd[21718]: Failed password for nagios from 10.20.9.40 port 49933 ssh2
Sep 02 04:55:21 rmg-vpn-01 sshd[21727]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 04:55:23 rmg-vpn-01 sshd[21727]: Failed password for nagios from 10.20.9.40 port 33011 ssh2
Sep 02 05:00:17 rmg-vpn-01 sshd[21735]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 05:00:19 rmg-vpn-01 sshd[21735]: Failed password for nagios from 10.20.9.40 port 30087 ssh2
Sep 02 05:00:35 rmg-vpn-01 sshd[22998]: Invalid user jenkins from 192.0.2.9 port 56592
Sep 02 05:00:36 rmg-vpn-01 sshd[22998]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 05:00:36 rmg-vpn-01 sshd[22998]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=192.0.2.9
Sep 02 05:00:38 rmg-vpn-01 sshd[22998]: Failed password for invalid user jenkins from 192.0.2.9 port 56592 ssh2
Sep 02 05:00:39 rmg-vpn-01 sshd[22998]: Connection closed by invalid user jenkins 192.0.2.9 port 56592 [preauth]
Sep 02 05:05:25 rmg-vpn-01 sshd[21738]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 05:05:27 rmg-vpn-01 sshd[21738]: Failed password for nagios from 10.20.9.40 port 32044 ssh2
Sep 02 05:10:29 rmg-vpn-01 sshd[21742]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 05:10:31 rmg-vpn-01 sshd[21742]: Failed password for nagios from 10.20.9.40 port 57640 ssh2
Sep 02 05:12:51 rmg-vpn-01 sshd[22984]: Invalid user user from 192.0.2.171 port 31137
Sep 02 05:12:52 rmg-vpn-01 sshd[22984]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 05:12:52 rmg-vpn-01 sshd[22984]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=192.0.2.171
Sep 02 05:12:54 rmg-vpn-01 sshd[22984]: Failed password for invalid user user from 192.0.2.171 port 31137 ssh2
Sep 02 05:12:55 rmg-vpn-01 sshd[22984]: Connection closed by invalid user user 192.0.2.171 port 31137 [preauth]
Sep 02 05:15:03 rmg-vpn-01 sshd[21750]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 05:15:05 rmg-vpn-01 sshd[21750]: Failed password for nagios from 10.20.9.40 port 64625 ssh2
Sep 02 05:17:01 rmg-vpn-01 CRON[19303]: pam_unix(cron:session): session opened for user root(uid=0) by (uid=0)
Sep 02 05:17:01 rmg-vpn-01 CRON[9291]: pam_unix(cron:session): session closed for user root
Sep 02 05:17:18 rmg-vpn-01 sshd[22967]: Invalid user admin from 192.0.2.44 port 49377
Sep 02 05:17:19 rmg-vpn-01 sshd[22967]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 05:17:19 rmg-vpn-01 sshd[22967]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=192.0.2.44
Sep 02 05:17:21 rmg-vpn-01 sshd[22967]: Failed password for invalid user admin from 192.0.2.44 port 49377 ssh2
Sep 02 05:17:22 rmg-vpn-01 sshd[22967]: Connection closed by invalid user admin 192.0.2.44 port 49377 [preauth]
Sep 02 05:20:18 rmg-vpn-01 sshd[21752]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 05:20:20 rmg-vpn-01 sshd[21752]: Failed password for nagios from 10.20.9.40 port 56237 ssh2
Sep 02 05:24:35 rmg-vpn-01 sshd[22971]: Invalid user git from 203.0.113.140 port 51708
Sep 02 05:24:36 rmg-vpn-01 sshd[22971]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 05:24:36 rmg-vpn-01 sshd[22971]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.140
Sep 02 05:24:38 rmg-vpn-01 sshd[22971]: Failed password for invalid user git from 203.0.113.140 port 51708 ssh2
Sep 02 05:24:39 rmg-vpn-01 sshd[22971]: Connection closed by invalid user git 203.0.113.140 port 51708 [preauth]
Sep 02 05:25:22 rmg-vpn-01 sshd[21758]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 05:25:24 rmg-vpn-01 sshd[21758]: Failed password for nagios from 10.20.9.40 port 53501 ssh2
Sep 02 05:30:02 rmg-vpn-01 sshd[21410]: Accepted publickey for svc-backup from 10.20.9.15 port 58754 ssh2
Sep 02 05:30:03 rmg-vpn-01 sshd[21410]: pam_unix(sshd:session): session opened for user svc-backup(uid=1500) by (uid=0)
Sep 02 05:30:15 rmg-vpn-01 sshd[21764]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 05:30:17 rmg-vpn-01 sshd[21764]: Failed password for nagios from 10.20.9.40 port 53450 ssh2
Sep 02 05:34:42 rmg-vpn-01 sshd[21410]: pam_unix(sshd:session): session closed for user svc-backup
Sep 02 05:35:28 rmg-vpn-01 sshd[21768]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 05:35:30 rmg-vpn-01 sshd[21768]: Failed password for nagios from 10.20.9.40 port 49696 ssh2
Sep 02 05:40:03 rmg-vpn-01 sshd[21769]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 05:40:05 rmg-vpn-01 sshd[21769]: Failed password for nagios from 10.20.9.40 port 31977 ssh2
Sep 02 05:42:56 rmg-vpn-01 sshd[22978]: Invalid user jenkins from 198.51.100.23 port 44030
Sep 02 05:42:57 rmg-vpn-01 sshd[22978]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 05:42:57 rmg-vpn-01 sshd[22978]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.23
Sep 02 05:42:59 rmg-vpn-01 sshd[22978]: Failed password for invalid user jenkins from 198.51.100.23 port 44030 ssh2
Sep 02 05:43:00 rmg-vpn-01 sshd[22978]: Connection closed by invalid user jenkins 198.51.100.23 port 44030 [preauth]
Sep 02 05:45:29 rmg-vpn-01 sshd[21771]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 05:45:31 rmg-vpn-01 sshd[21771]: Failed password for nagios from 10.20.9.40 port 61993 ssh2
Sep 02 05:48:52 rmg-vpn-01 sshd[22991]: Invalid user jenkins from 203.0.113.140 port 51753
Sep 02 05:48:53 rmg-vpn-01 sshd[22991]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 05:48:53 rmg-vpn-01 sshd[22991]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.140
Sep 02 05:48:55 rmg-vpn-01 sshd[22991]: Failed password for invalid user jenkins from 203.0.113.140 port 51753 ssh2
Sep 02 05:48:56 rmg-vpn-01 sshd[22991]: Connection closed by invalid user jenkins 203.0.113.140 port 51753 [preauth]
Sep 02 05:50:29 rmg-vpn-01 sshd[21779]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 05:50:31 rmg-vpn-01 sshd[21779]: Failed password for nagios from 10.20.9.40 port 63643 ssh2
Sep 02 05:55:09 rmg-vpn-01 sshd[21785]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 05:55:11 rmg-vpn-01 sshd[21785]: Failed password for nagios from 10.20.9.40 port 40327 ssh2
Sep 02 05:57:37 rmg-vpn-01 sshd[22972]: Invalid user guest from 198.51.100.202 port 45947
Sep 02 05:57:38 rmg-vpn-01 sshd[22972]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 05:57:38 rmg-vpn-01 sshd[22972]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.202
Sep 02 05:57:40 rmg-vpn-01 sshd[22972]: Failed password for invalid user guest from 198.51.100.202 port 45947 ssh2
Sep 02 05:57:41 rmg-vpn-01 sshd[22972]: Connection closed by invalid user guest 198.51.100.202 port 45947 [preauth]
Sep 02 06:00:22 rmg-vpn-01 sshd[21787]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 06:00:24 rmg-vpn-01 sshd[21787]: Failed password for nagios from 10.20.9.40 port 59612 ssh2
Sep 02 06:05:29 rmg-vpn-01 sshd[21791]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 06:05:31 rmg-vpn-01 sshd[21791]: Failed password for nagios from 10.20.9.40 port 63756 ssh2
Sep 02 06:10:02 rmg-vpn-01 sshd[21798]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 06:10:04 rmg-vpn-01 sshd[21798]: Failed password for nagios from 10.20.9.40 port 36251 ssh2
Sep 02 06:15:16 rmg-vpn-01 sshd[21803]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 06:15:18 rmg-vpn-01 sshd[21803]: Failed password for nagios from 10.20.9.40 port 49169 ssh2
Sep 02 06:16:26 rmg-vpn-01 sshd[23005]: Invalid user support from 192.0.2.9 port 52528
Sep 02 06:16:27 rmg-vpn-01 sshd[23005]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 06:16:27 rmg-vpn-01 sshd[23005]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=192.0.2.9
Sep 02 06:16:29 rmg-vpn-01 sshd[23005]: Failed password for invalid user support from 192.0.2.9 port 52528 ssh2
Sep 02 06:16:30 rmg-vpn-01 sshd[23005]: Connection closed by invalid user support 192.0.2.9 port 52528 [preauth]
Sep 02 06:17:01 rmg-vpn-01 CRON[27011]: pam_unix(cron:session): session opened for user root(uid=0) by (uid=0)
Sep 02 06:17:01 rmg-vpn-01 CRON[15041]: pam_unix(cron:session): session closed for user root
Sep 02 06:20:21 rmg-vpn-01 sshd[21807]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 06:20:23 rmg-vpn-01 sshd[21807]: Failed password for nagios from 10.20.9.40 port 36604 ssh2
Sep 02 06:25:03 rmg-vpn-01 sshd[21813]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 06:25:05 rmg-vpn-01 sshd[21813]: Failed password for nagios from 10.20.9.40 port 60703 ssh2
Sep 02 06:30:29 rmg-vpn-01 sshd[21818]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 06:30:31 rmg-vpn-01 sshd[21818]: Failed password for nagios from 10.20.9.40 port 42760 ssh2
Sep 02 06:35:15 rmg-vpn-01 sshd[21822]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 06:35:17 rmg-vpn-01 sshd[21822]: Failed password for nagios from 10.20.9.40 port 57712 ssh2
Sep 02 06:40:13 rmg-vpn-01 sshd[21829]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 06:40:15 rmg-vpn-01 sshd[21829]: Failed password for nagios from 10.20.9.40 port 43753 ssh2
Sep 02 06:45:11 rmg-vpn-01 sshd[21834]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 06:45:13 rmg-vpn-01 sshd[21834]: Failed password for nagios from 10.20.9.40 port 36074 ssh2
Sep 02 06:50:21 rmg-vpn-01 sshd[21842]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 06:50:23 rmg-vpn-01 sshd[21842]: Failed password for nagios from 10.20.9.40 port 43592 ssh2
Sep 02 06:52:46 rmg-vpn-01 sshd[23008]: Invalid user admin from 203.0.113.12 port 42564
Sep 02 06:52:47 rmg-vpn-01 sshd[23008]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 06:52:47 rmg-vpn-01 sshd[23008]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12
Sep 02 06:52:49 rmg-vpn-01 sshd[23008]: Failed password for invalid user admin from 203.0.113.12 port 42564 ssh2
Sep 02 06:52:50 rmg-vpn-01 sshd[23008]: Connection closed by invalid user admin 203.0.113.12 port 42564 [preauth]
Sep 02 06:55:28 rmg-vpn-01 sshd[21843]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 06:55:30 rmg-vpn-01 sshd[21843]: Failed password for nagios from 10.20.9.40 port 36283 ssh2
Sep 02 07:00:20 rmg-vpn-01 sshd[21849]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 07:00:22 rmg-vpn-01 sshd[21849]: Failed password for nagios from 10.20.9.40 port 48546 ssh2
Sep 02 07:05:08 rmg-vpn-01 sshd[21853]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 07:05:10 rmg-vpn-01 sshd[21853]: Failed password for nagios from 10.20.9.40 port 58096 ssh2
Sep 02 07:10:09 rmg-vpn-01 sshd[21858]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 07:10:11 rmg-vpn-01 sshd[21858]: Failed password for nagios from 10.20.9.40 port 39948 ssh2
Sep 02 07:15:04 rmg-vpn-01 sshd[21864]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 07:15:06 rmg-vpn-01 sshd[21864]: Failed password for nagios from 10.20.9.40 port 53937 ssh2
Sep 02 07:17:01 rmg-vpn-01 CRON[16166]: pam_unix(cron:session): session opened for user root(uid=0) by (uid=0)
Sep 02 07:17:01 rmg-vpn-01 CRON[11906]: pam_unix(cron:session): session closed for user root
Sep 02 07:20:22 rmg-vpn-01 sshd[23032]: Invalid user ftpuser from 192.0.2.171 port 32014
Sep 02 07:20:23 rmg-vpn-01 sshd[23032]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 07:20:23 rmg-vpn-01 sshd[23032]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=192.0.2.171
Sep 02 07:20:25 rmg-vpn-01 sshd[23032]: Failed password for invalid user ftpuser from 192.0.2.171 port 32014 ssh2
Sep 02 07:20:26 rmg-vpn-01 sshd[23032]: Connection closed by invalid user ftpuser 192.0.2.171 port 32014 [preauth]
Sep 02 07:20:30 rmg-vpn-01 sshd[21865]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 07:20:32 rmg-vpn-01 sshd[21865]: Failed password for nagios from 10.20.9.40 port 30158 ssh2
Sep 02 07:25:10 rmg-vpn-01 sshd[21872]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 07:25:12 rmg-vpn-01 sshd[21872]: Failed password for nagios from 10.20.9.40 port 43100 ssh2
Sep 02 07:30:29 rmg-vpn-01 sshd[21876]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 07:30:31 rmg-vpn-01 sshd[21876]: Failed password for nagios from 10.20.9.40 port 31732 ssh2
Sep 02 07:32:05 rmg-vpn-01 sshd[23010]: Invalid user ftpuser from 198.51.100.23 port 58124
Sep 02 07:32:06 rmg-vpn-01 sshd[23010]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 07:32:06 rmg-vpn-01 sshd[23010]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.23
Sep 02 07:32:08 rmg-vpn-01 sshd[23010]: Failed password for invalid user ftpuser from 198.51.100.23 port 58124 ssh2
Sep 02 07:32:09 rmg-vpn-01 sshd[23010]: Connection closed by invalid user ftpuser 198.51.100.23 port 58124 [preauth]
Sep 02 07:35:21 rmg-vpn-01 sshd[21883]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 07:35:23 rmg-vpn-01 sshd[21883]: Failed password for nagios from 10.20.9.40 port 57011 ssh2
Sep 02 07:37:53 rmg-vpn-01 sshd[23019]: Invalid user admin from 192.0.2.171 port 31059
Sep 02 07:37:54 rmg-vpn-01 sshd[23019]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 07:37:54 rmg-vpn-01 sshd[23019]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=192.0.2.171
Sep 02 07:37:56 rmg-vpn-01 sshd[23019]: Failed password for invalid user admin from 192.0.2.171 port 31059 ssh2
Sep 02 07:37:57 rmg-vpn-01 sshd[23019]: Connection closed by invalid user admin 192.0.2.171 port 31059 [preauth]
Sep 02 07:38:39 rmg-vpn-01 sshd[23400]: Accepted password for jmartel from 10.20.4.31 port 37295 ssh2
Sep 02 07:38:40 rmg-vpn-01 sshd[23400]: pam_unix(sshd:session): session opened for user jmartel(uid=1001) by (uid=0)
Sep 02 07:40:01 rmg-vpn-01 sshd[21891]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 07:40:03 rmg-vpn-01 sshd[21891]: Failed password for nagios from 10.20.9.40 port 62498 ssh2
Sep 02 07:42:21 rmg-vpn-01 sshd[23024]: Invalid user ubuntu from 192.0.2.44 port 39583
Sep 02 07:42:22 rmg-vpn-01 sshd[23024]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 07:42:22 rmg-vpn-01 sshd[23024]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=192.0.2.44
Sep 02 07:42:24 rmg-vpn-01 sshd[23024]: Failed password for invalid user ubuntu from 192.0.2.44 port 39583 ssh2
Sep 02 07:42:25 rmg-vpn-01 sshd[23024]: Connection closed by invalid user ubuntu 192.0.2.44 port 39583 [preauth]
Sep 02 07:45:23 rmg-vpn-01 sshd[21894]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 07:45:25 rmg-vpn-01 sshd[21894]: Failed password for nagios from 10.20.9.40 port 51926 ssh2
Sep 02 07:49:32 rmg-vpn-01 sshd[23401]: Accepted password for dokafor from 10.20.4.58 port 34014 ssh2
Sep 02 07:49:33 rmg-vpn-01 sshd[23401]: pam_unix(sshd:session): session opened for user dokafor(uid=1002) by (uid=0)
Sep 02 07:50:00 rmg-vpn-01 sshd[21900]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 07:50:02 rmg-vpn-01 sshd[21900]: Failed password for nagios from 10.20.9.40 port 48570 ssh2
Sep 02 07:53:14 rmg-vpn-01 sshd[23017]: Invalid user admin from 192.0.2.171 port 49844
Sep 02 07:53:15 rmg-vpn-01 sshd[23017]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 07:53:15 rmg-vpn-01 sshd[23017]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=192.0.2.171
Sep 02 07:53:17 rmg-vpn-01 sshd[23017]: Failed password for invalid user admin from 192.0.2.171 port 49844 ssh2
Sep 02 07:53:18 rmg-vpn-01 sshd[23017]: Connection closed by invalid user admin 192.0.2.171 port 49844 [preauth]
Sep 02 07:55:12 rmg-vpn-01 sshd[21908]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 07:55:14 rmg-vpn-01 sshd[21908]: Failed password for nagios from 10.20.9.40 port 60890 ssh2
Sep 02 08:00:27 rmg-vpn-01 sshd[21913]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 08:00:29 rmg-vpn-01 sshd[21913]: Failed password for nagios from 10.20.9.40 port 60467 ssh2
Sep 02 08:00:42 rmg-vpn-01 sshd[23404]: Accepted password for rchen from 10.20.4.12 port 53818 ssh2
Sep 02 08:00:43 rmg-vpn-01 sshd[23404]: pam_unix(sshd:session): session opened for user rchen(uid=1003) by (uid=0)
Sep 02 08:04:01 rmg-vpn-01 sshd[23065]: Invalid user postgres from 198.51.100.202 port 55186
Sep 02 08:04:02 rmg-vpn-01 sshd[23065]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 08:04:02 rmg-vpn-01 sshd[23065]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.202
Sep 02 08:04:04 rmg-vpn-01 sshd[23065]: Failed password for invalid user postgres from 198.51.100.202 port 55186 ssh2
Sep 02 08:04:05 rmg-vpn-01 sshd[23065]: Connection closed by invalid user postgres 198.51.100.202 port 55186 [preauth]
Sep 02 08:05:19 rmg-vpn-01 sshd[21915]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 08:05:21 rmg-vpn-01 sshd[21915]: Failed password for nagios from 10.20.9.40 port 37549 ssh2
Sep 02 08:10:14 rmg-vpn-01 sshd[21918]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 08:10:16 rmg-vpn-01 sshd[21918]: Failed password for nagios from 10.20.9.40 port 32790 ssh2
Sep 02 08:15:21 rmg-vpn-01 sshd[21923]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 08:15:23 rmg-vpn-01 sshd[21923]: Failed password for nagios from 10.20.9.40 port 30751 ssh2
Sep 02 08:15:33 rmg-vpn-01 sudo:  jmartel : TTY=pts/2 ; PWD=/home/jmartel ; USER=root ; COMMAND=/usr/bin/apt-get upgrade -y
Sep 02 08:15:33 rmg-vpn-01 sudo: pam_unix(sudo:session): session opened for user root(uid=0) by jmartel(uid=1001)
Sep 02 08:17:01 rmg-vpn-01 CRON[21876]: pam_unix(cron:session): session opened for user root(uid=0) by (uid=0)
Sep 02 08:17:01 rmg-vpn-01 CRON[17259]: pam_unix(cron:session): session closed for user root
Sep 02 08:20:22 rmg-vpn-01 sshd[21928]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 08:20:24 rmg-vpn-01 sshd[21928]: Failed password for nagios from 10.20.9.40 port 39067 ssh2
Sep 02 08:22:05 rmg-vpn-01 sshd[23053]: Invalid user git from 203.0.113.12 port 61929
Sep 02 08:22:06 rmg-vpn-01 sshd[23053]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 08:22:06 rmg-vpn-01 sshd[23053]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12
Sep 02 08:22:08 rmg-vpn-01 sshd[23053]: Failed password for invalid user git from 203.0.113.12 port 61929 ssh2
Sep 02 08:22:09 rmg-vpn-01 sshd[23053]: Connection closed by invalid user git 203.0.113.12 port 61929 [preauth]
Sep 02 08:22:29 rmg-vpn-01 sshd[23045]: Invalid user oracle from 192.0.2.171 port 45556
Sep 02 08:22:30 rmg-vpn-01 sshd[23045]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 08:22:30 rmg-vpn-01 sshd[23045]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=192.0.2.171
Sep 02 08:22:32 rmg-vpn-01 sshd[23045]: Failed password for invalid user oracle from 192.0.2.171 port 45556 ssh2
Sep 02 08:22:33 rmg-vpn-01 sshd[23045]: Connection closed by invalid user oracle 192.0.2.171 port 45556 [preauth]
Sep 02 08:22:47 rmg-vpn-01 sudo: pam_unix(sudo:session): session closed for user root
Sep 02 08:25:05 rmg-vpn-01 sshd[21936]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 08:25:07 rmg-vpn-01 sshd[21936]: Failed password for nagios from 10.20.9.40 port 48596 ssh2
Sep 02 08:25:22 rmg-vpn-01 sshd[23041]: Invalid user postgres from 203.0.113.201 port 56533
Sep 02 08:25:23 rmg-vpn-01 sshd[23041]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 08:25:23 rmg-vpn-01 sshd[23041]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.201
Sep 02 08:25:25 rmg-vpn-01 sshd[23041]: Failed password for invalid user postgres from 203.0.113.201 port 56533 ssh2
Sep 02 08:25:26 rmg-vpn-01 sshd[23041]: Connection closed by invalid user postgres 203.0.113.201 port 56533 [preauth]
Sep 02 08:30:09 rmg-vpn-01 sshd[21945]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 08:30:11 rmg-vpn-01 sshd[21945]: Failed password for nagios from 10.20.9.40 port 55488 ssh2
Sep 02 08:35:09 rmg-vpn-01 sshd[21951]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 08:35:11 rmg-vpn-01 sshd[21951]: Failed password for nagios from 10.20.9.40 port 30815 ssh2
Sep 02 08:40:10 rmg-vpn-01 sshd[21956]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 08:40:12 rmg-vpn-01 sshd[21956]: Failed password for nagios from 10.20.9.40 port 39222 ssh2
Sep 02 08:43:47 rmg-vpn-01 sshd[23059]: Invalid user mysql from 198.51.100.23 port 42859
Sep 02 08:43:48 rmg-vpn-01 sshd[23059]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 08:43:48 rmg-vpn-01 sshd[23059]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.23
Sep 02 08:43:50 rmg-vpn-01 sshd[23059]: Failed password for invalid user mysql from 198.51.100.23 port 42859 ssh2
Sep 02 08:43:51 rmg-vpn-01 sshd[23059]: Connection closed by invalid user mysql 198.51.100.23 port 42859 [preauth]
Sep 02 08:45:22 rmg-vpn-01 sshd[21964]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 08:45:24 rmg-vpn-01 sshd[21964]: Failed password for nagios from 10.20.9.40 port 56201 ssh2
Sep 02 08:45:51 rmg-vpn-01 sshd[23061]: Invalid user ftpuser from 203.0.113.140 port 49312
Sep 02 08:45:52 rmg-vpn-01 sshd[23061]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 08:45:52 rmg-vpn-01 sshd[23061]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.140
Sep 02 08:45:54 rmg-vpn-01 sshd[23061]: Failed password for invalid user ftpuser from 203.0.113.140 port 49312 ssh2
Sep 02 08:45:55 rmg-vpn-01 sshd[23061]: Connection closed by invalid user ftpuser 203.0.113.140 port 49312 [preauth]
Sep 02 08:50:06 rmg-vpn-01 sshd[21967]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 08:50:08 rmg-vpn-01 sshd[21967]: Failed password for nagios from 10.20.9.40 port 39894 ssh2
Sep 02 08:55:15 rmg-vpn-01 sshd[21968]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 08:55:17 rmg-vpn-01 sshd[21968]: Failed password for nagios from 10.20.9.40 port 38489 ssh2
Sep 02 08:58:19 rmg-vpn-01 sshd[23064]: Invalid user oracle from 198.51.100.23 port 59652
Sep 02 08:58:20 rmg-vpn-01 sshd[23064]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 08:58:20 rmg-vpn-01 sshd[23064]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.23
Sep 02 08:58:22 rmg-vpn-01 sshd[23064]: Failed password for invalid user oracle from 198.51.100.23 port 59652 ssh2
Sep 02 08:58:23 rmg-vpn-01 sshd[23064]: Connection closed by invalid user oracle 198.51.100.23 port 59652 [preauth]
Sep 02 09:00:20 rmg-vpn-01 sshd[21977]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 09:00:22 rmg-vpn-01 sshd[21977]: Failed password for nagios from 10.20.9.40 port 38301 ssh2
Sep 02 09:02:14 rmg-vpn-01 sshd[23408]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.4.58  user=dokafor
Sep 02 09:02:16 rmg-vpn-01 sshd[23408]: Failed password for dokafor from 10.20.4.58 port 61827 ssh2
Sep 02 09:02:31 rmg-vpn-01 sshd[23412]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.4.58  user=dokafor
Sep 02 09:02:33 rmg-vpn-01 sshd[23412]: Failed password for dokafor from 10.20.4.58 port 30033 ssh2
Sep 02 09:02:58 rmg-vpn-01 sshd[23417]: Accepted password for dokafor from 10.20.4.58 port 44492 ssh2
Sep 02 09:02:59 rmg-vpn-01 sshd[23417]: pam_unix(sshd:session): session opened for user dokafor(uid=1002) by (uid=0)
Sep 02 09:05:29 rmg-vpn-01 sshd[21979]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 09:05:31 rmg-vpn-01 sshd[21979]: Failed password for nagios from 10.20.9.40 port 43938 ssh2
Sep 02 09:09:10 rmg-vpn-01 sshd[23094]: Invalid user jenkins from 192.0.2.44 port 45675
Sep 02 09:09:11 rmg-vpn-01 sshd[23094]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:09:11 rmg-vpn-01 sshd[23094]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=192.0.2.44
Sep 02 09:09:13 rmg-vpn-01 sshd[23094]: Failed password for invalid user jenkins from 192.0.2.44 port 45675 ssh2
Sep 02 09:09:14 rmg-vpn-01 sshd[23094]: Connection closed by invalid user jenkins 192.0.2.44 port 45675 [preauth]
Sep 02 09:10:19 rmg-vpn-01 sshd[21985]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 09:10:21 rmg-vpn-01 sshd[21985]: Failed password for nagios from 10.20.9.40 port 38787 ssh2
Sep 02 09:12:03 rmg-vpn-01 sshd[23424]: Invalid user git from 203.0.113.90 port 45884
Sep 02 09:12:04 rmg-vpn-01 sshd[23424]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:12:04 rmg-vpn-01 sshd[23424]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:12:06 rmg-vpn-01 sshd[23424]: Failed password for invalid user git from 203.0.113.90 port 45884 ssh2
Sep 02 09:12:07 rmg-vpn-01 sshd[23424]: Connection closed by invalid user git 203.0.113.90 port 45884 [preauth]
Sep 02 09:12:12 rmg-vpn-01 sshd[23433]: Invalid user git from 198.51.100.77 port 48708
Sep 02 09:12:13 rmg-vpn-01 sshd[23433]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:12:13 rmg-vpn-01 sshd[23433]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.77
Sep 02 09:12:15 rmg-vpn-01 sshd[23433]: Failed password for invalid user git from 198.51.100.77 port 48708 ssh2
Sep 02 09:12:16 rmg-vpn-01 sshd[23433]: Connection closed by invalid user git 198.51.100.77 port 48708 [preauth]
Sep 02 09:12:23 rmg-vpn-01 sshd[23442]: Invalid user deploy from 203.0.113.12 port 50650
Sep 02 09:12:24 rmg-vpn-01 sshd[23442]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:12:24 rmg-vpn-01 sshd[23442]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12
Sep 02 09:12:26 rmg-vpn-01 sshd[23442]: Failed password for invalid user deploy from 203.0.113.12 port 50650 ssh2
Sep 02 09:12:27 rmg-vpn-01 sshd[23442]: Connection closed by invalid user deploy 203.0.113.12 port 50650 [preauth]
Sep 02 09:12:32 rmg-vpn-01 sshd[23448]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.88  user=root
Sep 02 09:12:34 rmg-vpn-01 sshd[23448]: Failed password for root from 203.0.113.88 port 56368 ssh2
Sep 02 09:12:37 rmg-vpn-01 sshd[23449]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90  user=root
Sep 02 09:12:39 rmg-vpn-01 sshd[23449]: Failed password for root from 203.0.113.90 port 51640 ssh2
Sep 02 09:12:42 rmg-vpn-01 sshd[23456]: Invalid user deploy from 203.0.113.90 port 34808
Sep 02 09:12:43 rmg-vpn-01 sshd[23456]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:12:43 rmg-vpn-01 sshd[23456]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:12:45 rmg-vpn-01 sshd[23456]: Failed password for invalid user deploy from 203.0.113.90 port 34808 ssh2
Sep 02 09:12:46 rmg-vpn-01 sshd[23456]: Connection closed by invalid user deploy 203.0.113.90 port 34808 [preauth]
Sep 02 09:12:49 rmg-vpn-01 sshd[23458]: Invalid user deploy from 203.0.113.90 port 44226
Sep 02 09:12:50 rmg-vpn-01 sshd[23458]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:12:50 rmg-vpn-01 sshd[23458]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:12:52 rmg-vpn-01 sshd[23458]: Failed password for invalid user deploy from 203.0.113.90 port 44226 ssh2
Sep 02 09:12:53 rmg-vpn-01 sshd[23458]: Connection closed by invalid user deploy 203.0.113.90 port 44226 [preauth]
Sep 02 09:12:56 rmg-vpn-01 sshd[23463]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90  user=postgres
Sep 02 09:12:58 rmg-vpn-01 sshd[23463]: Failed password for postgres from 203.0.113.90 port 46469 ssh2
Sep 02 09:13:05 rmg-vpn-01 sshd[23472]: Invalid user git from 203.0.113.90 port 46518
Sep 02 09:13:06 rmg-vpn-01 sshd[23472]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:13:06 rmg-vpn-01 sshd[23472]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:13:08 rmg-vpn-01 sshd[23472]: Failed password for invalid user git from 203.0.113.90 port 46518 ssh2
Sep 02 09:13:09 rmg-vpn-01 sshd[23472]: Connection closed by invalid user git 203.0.113.90 port 46518 [preauth]
Sep 02 09:13:13 rmg-vpn-01 sshd[23476]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90  user=jdelacruz
Sep 02 09:13:15 rmg-vpn-01 sshd[23476]: Failed password for jdelacruz from 203.0.113.90 port 50545 ssh2
Sep 02 09:13:18 rmg-vpn-01 sshd[23483]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.77  user=jdelacruz
Sep 02 09:13:20 rmg-vpn-01 sshd[23483]: Failed password for jdelacruz from 198.51.100.77 port 57886 ssh2
Sep 02 09:13:23 rmg-vpn-01 sshd[23488]: Invalid user oracle from 203.0.113.90 port 35266
Sep 02 09:13:24 rmg-vpn-01 sshd[23488]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:13:24 rmg-vpn-01 sshd[23488]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:13:26 rmg-vpn-01 sshd[23488]: Failed password for invalid user oracle from 203.0.113.90 port 35266 ssh2
Sep 02 09:13:27 rmg-vpn-01 sshd[23488]: Connection closed by invalid user oracle 203.0.113.90 port 35266 [preauth]
Sep 02 09:13:27 rmg-vpn-01 sshd[23490]: Invalid user admin from 203.0.113.90 port 53278
Sep 02 09:13:28 rmg-vpn-01 sshd[23490]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:13:28 rmg-vpn-01 sshd[23490]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:13:30 rmg-vpn-01 sshd[23490]: Failed password for invalid user admin from 203.0.113.90 port 53278 ssh2
Sep 02 09:13:31 rmg-vpn-01 sshd[23490]: Connection closed by invalid user admin 203.0.113.90 port 53278 [preauth]
Sep 02 09:13:38 rmg-vpn-01 sshd[23498]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90  user=root
Sep 02 09:13:40 rmg-vpn-01 sshd[23498]: Failed password for root from 203.0.113.90 port 57749 ssh2
Sep 02 09:13:49 rmg-vpn-01 sshd[23501]: Invalid user git from 203.0.113.90 port 60994
Sep 02 09:13:50 rmg-vpn-01 sshd[23501]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:13:50 rmg-vpn-01 sshd[23501]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:13:52 rmg-vpn-01 sshd[23501]: Failed password for invalid user git from 203.0.113.90 port 60994 ssh2
Sep 02 09:13:53 rmg-vpn-01 sshd[23501]: Connection closed by invalid user git 203.0.113.90 port 60994 [preauth]
Sep 02 09:13:59 rmg-vpn-01 sshd[23502]: Invalid user git from 203.0.113.90 port 48054
Sep 02 09:14:00 rmg-vpn-01 sshd[23502]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:14:00 rmg-vpn-01 sshd[23502]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:14:02 rmg-vpn-01 sshd[23502]: Failed password for invalid user git from 203.0.113.90 port 48054 ssh2
Sep 02 09:14:03 rmg-vpn-01 sshd[23502]: Connection closed by invalid user git 203.0.113.90 port 48054 [preauth]
Sep 02 09:14:09 rmg-vpn-01 sshd[23508]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90  user=jdelacruz
Sep 02 09:14:11 rmg-vpn-01 sshd[23508]: Failed password for jdelacruz from 203.0.113.90 port 54072 ssh2
Sep 02 09:14:15 rmg-vpn-01 sshd[23511]: Invalid user git from 203.0.113.90 port 48944
Sep 02 09:14:16 rmg-vpn-01 sshd[23511]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:14:16 rmg-vpn-01 sshd[23511]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:14:18 rmg-vpn-01 sshd[23511]: Failed password for invalid user git from 203.0.113.90 port 48944 ssh2
Sep 02 09:14:19 rmg-vpn-01 sshd[23511]: Connection closed by invalid user git 203.0.113.90 port 48944 [preauth]
Sep 02 09:14:19 rmg-vpn-01 sshd[23516]: Invalid user deploy from 203.0.113.90 port 42842
Sep 02 09:14:20 rmg-vpn-01 sshd[23516]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:14:20 rmg-vpn-01 sshd[23516]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:14:22 rmg-vpn-01 sshd[23516]: Failed password for invalid user deploy from 203.0.113.90 port 42842 ssh2
Sep 02 09:14:23 rmg-vpn-01 sshd[23516]: Connection closed by invalid user deploy 203.0.113.90 port 42842 [preauth]
Sep 02 09:14:30 rmg-vpn-01 sshd[23524]: Invalid user git from 203.0.113.88 port 60296
Sep 02 09:14:31 rmg-vpn-01 sshd[23524]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:14:31 rmg-vpn-01 sshd[23524]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.88
Sep 02 09:14:33 rmg-vpn-01 sshd[23524]: Failed password for invalid user git from 203.0.113.88 port 60296 ssh2
Sep 02 09:14:34 rmg-vpn-01 sshd[23524]: Connection closed by invalid user git 203.0.113.88 port 60296 [preauth]
Sep 02 09:14:39 rmg-vpn-01 sshd[23532]: Invalid user ubuntu from 203.0.113.90 port 35893
Sep 02 09:14:40 rmg-vpn-01 sshd[23532]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:14:40 rmg-vpn-01 sshd[23532]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:14:42 rmg-vpn-01 sshd[23532]: Failed password for invalid user ubuntu from 203.0.113.90 port 35893 ssh2
Sep 02 09:14:43 rmg-vpn-01 sshd[23532]: Connection closed by invalid user ubuntu 203.0.113.90 port 35893 [preauth]
Sep 02 09:14:47 rmg-vpn-01 sshd[23539]: Invalid user admin from 198.51.100.77 port 59308
Sep 02 09:14:48 rmg-vpn-01 sshd[23539]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:14:48 rmg-vpn-01 sshd[23539]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.77
Sep 02 09:14:50 rmg-vpn-01 sshd[23539]: Failed password for invalid user admin from 198.51.100.77 port 59308 ssh2
Sep 02 09:14:51 rmg-vpn-01 sshd[23539]: Connection closed by invalid user admin 198.51.100.77 port 59308 [preauth]
Sep 02 09:14:52 rmg-vpn-01 sshd[23546]: Invalid user oracle from 203.0.113.90 port 41956
Sep 02 09:14:53 rmg-vpn-01 sshd[23546]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:14:53 rmg-vpn-01 sshd[23546]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:14:55 rmg-vpn-01 sshd[23546]: Failed password for invalid user oracle from 203.0.113.90 port 41956 ssh2
Sep 02 09:14:56 rmg-vpn-01 sshd[23546]: Connection closed by invalid user oracle 203.0.113.90 port 41956 [preauth]
Sep 02 09:14:59 rmg-vpn-01 sshd[23548]: Invalid user ubuntu from 203.0.113.90 port 51353
Sep 02 09:15:00 rmg-vpn-01 sshd[23548]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:15:00 rmg-vpn-01 sshd[23548]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:15:02 rmg-vpn-01 sshd[23548]: Failed password for invalid user ubuntu from 203.0.113.90 port 51353 ssh2
Sep 02 09:15:03 rmg-vpn-01 sshd[23548]: Connection closed by invalid user ubuntu 203.0.113.90 port 51353 [preauth]
Sep 02 09:15:07 rmg-vpn-01 sshd[23549]: Invalid user oracle from 203.0.113.90 port 64316
Sep 02 09:15:08 rmg-vpn-01 sshd[23549]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:15:08 rmg-vpn-01 sshd[23549]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:15:10 rmg-vpn-01 sshd[23549]: Failed password for invalid user oracle from 203.0.113.90 port 64316 ssh2
Sep 02 09:15:11 rmg-vpn-01 sshd[23549]: Connection closed by invalid user oracle 203.0.113.90 port 64316 [preauth]
Sep 02 09:15:14 rmg-vpn-01 sshd[23551]: Invalid user oracle from 203.0.113.90 port 61925
Sep 02 09:15:15 rmg-vpn-01 sshd[23551]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:15:15 rmg-vpn-01 sshd[23551]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:15:17 rmg-vpn-01 sshd[23551]: Failed password for invalid user oracle from 203.0.113.90 port 61925 ssh2
Sep 02 09:15:18 rmg-vpn-01 sshd[23551]: Connection closed by invalid user oracle 203.0.113.90 port 61925 [preauth]
Sep 02 09:15:22 rmg-vpn-01 sshd[21987]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 09:15:24 rmg-vpn-01 sshd[21987]: Failed password for nagios from 10.20.9.40 port 32284 ssh2
Sep 02 09:15:25 rmg-vpn-01 sshd[23558]: Invalid user oracle from 203.0.113.90 port 40956
Sep 02 09:15:26 rmg-vpn-01 sshd[23558]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:15:26 rmg-vpn-01 sshd[23558]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:15:28 rmg-vpn-01 sshd[23558]: Failed password for invalid user oracle from 203.0.113.90 port 40956 ssh2
Sep 02 09:15:29 rmg-vpn-01 sshd[23558]: Connection closed by invalid user oracle 203.0.113.90 port 40956 [preauth]
Sep 02 09:15:31 rmg-vpn-01 sshd[23564]: Invalid user test from 203.0.113.90 port 51242
Sep 02 09:15:32 rmg-vpn-01 sshd[23564]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:15:32 rmg-vpn-01 sshd[23564]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:15:34 rmg-vpn-01 sshd[23564]: Failed password for invalid user test from 203.0.113.90 port 51242 ssh2
Sep 02 09:15:35 rmg-vpn-01 sshd[23564]: Connection closed by invalid user test 203.0.113.90 port 51242 [preauth]
Sep 02 09:15:40 rmg-vpn-01 sshd[23573]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.77  user=root
Sep 02 09:15:42 rmg-vpn-01 sshd[23573]: Failed password for root from 198.51.100.77 port 48034 ssh2
Sep 02 09:15:51 rmg-vpn-01 sshd[23576]: Invalid user ubuntu from 203.0.113.90 port 35267
Sep 02 09:15:52 rmg-vpn-01 sshd[23576]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:15:52 rmg-vpn-01 sshd[23576]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:15:53 rmg-vpn-01 sshd[23066]: Invalid user mysql from 192.0.2.171 port 48670
Sep 02 09:15:54 rmg-vpn-01 sshd[23066]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:15:54 rmg-vpn-01 sshd[23066]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=192.0.2.171
Sep 02 09:15:54 rmg-vpn-01 sshd[23576]: Failed password for invalid user ubuntu from 203.0.113.90 port 35267 ssh2
Sep 02 09:15:55 rmg-vpn-01 sshd[23576]: Connection closed by invalid user ubuntu 203.0.113.90 port 35267 [preauth]
Sep 02 09:15:56 rmg-vpn-01 sshd[23066]: Failed password for invalid user mysql from 192.0.2.171 port 48670 ssh2
Sep 02 09:15:56 rmg-vpn-01 sshd[23583]: Invalid user deploy from 198.51.100.77 port 41395
Sep 02 09:15:57 rmg-vpn-01 sshd[23066]: Connection closed by invalid user mysql 192.0.2.171 port 48670 [preauth]
Sep 02 09:15:57 rmg-vpn-01 sshd[23583]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:15:57 rmg-vpn-01 sshd[23583]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.77
Sep 02 09:15:59 rmg-vpn-01 sshd[23583]: Failed password for invalid user deploy from 198.51.100.77 port 41395 ssh2
Sep 02 09:16:00 rmg-vpn-01 sshd[23583]: Connection closed by invalid user deploy 198.51.100.77 port 41395 [preauth]
Sep 02 09:16:06 rmg-vpn-01 sshd[23588]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.77  user=postgres
Sep 02 09:16:08 rmg-vpn-01 sshd[23588]: Failed password for postgres from 198.51.100.77 port 56320 ssh2
Sep 02 09:16:16 rmg-vpn-01 sshd[23596]: Invalid user git from 203.0.113.12 port 49116
Sep 02 09:16:17 rmg-vpn-01 sshd[23596]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:16:17 rmg-vpn-01 sshd[23596]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12
Sep 02 09:16:19 rmg-vpn-01 sshd[23596]: Failed password for invalid user git from 203.0.113.12 port 49116 ssh2
Sep 02 09:16:20 rmg-vpn-01 sshd[23596]: Connection closed by invalid user git 203.0.113.12 port 49116 [preauth]
Sep 02 09:16:20 rmg-vpn-01 sshd[23605]: Invalid user test from 203.0.113.90 port 40919
Sep 02 09:16:21 rmg-vpn-01 sshd[23605]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:16:21 rmg-vpn-01 sshd[23605]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:16:23 rmg-vpn-01 sshd[23605]: Failed password for invalid user test from 203.0.113.90 port 40919 ssh2
Sep 02 09:16:24 rmg-vpn-01 sshd[23605]: Connection closed by invalid user test 203.0.113.90 port 40919 [preauth]
Sep 02 09:16:24 rmg-vpn-01 sshd[23614]: Invalid user git from 203.0.113.90 port 34367
Sep 02 09:16:25 rmg-vpn-01 sshd[23614]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:16:25 rmg-vpn-01 sshd[23614]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:16:27 rmg-vpn-01 sshd[23614]: Failed password for invalid user git from 203.0.113.90 port 34367 ssh2
Sep 02 09:16:27 rmg-vpn-01 sshd[23620]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90  user=postgres
Sep 02 09:16:28 rmg-vpn-01 sshd[23614]: Connection closed by invalid user git 203.0.113.90 port 34367 [preauth]
Sep 02 09:16:29 rmg-vpn-01 sshd[23620]: Failed password for postgres from 203.0.113.90 port 51631 ssh2
Sep 02 09:16:30 rmg-vpn-01 sshd[23629]: Invalid user deploy from 203.0.113.90 port 60572
Sep 02 09:16:31 rmg-vpn-01 sshd[23629]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:16:31 rmg-vpn-01 sshd[23629]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:16:33 rmg-vpn-01 sshd[23629]: Failed password for invalid user deploy from 203.0.113.90 port 60572 ssh2
Sep 02 09:16:34 rmg-vpn-01 sshd[23629]: Connection closed by invalid user deploy 203.0.113.90 port 60572 [preauth]
Sep 02 09:16:38 rmg-vpn-01 sshd[23635]: Invalid user test from 198.51.100.77 port 50250
Sep 02 09:16:39 rmg-vpn-01 sshd[23635]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:16:39 rmg-vpn-01 sshd[23635]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.77
Sep 02 09:16:41 rmg-vpn-01 sshd[23635]: Failed password for invalid user test from 198.51.100.77 port 50250 ssh2
Sep 02 09:16:42 rmg-vpn-01 sshd[23635]: Connection closed by invalid user test 198.51.100.77 port 50250 [preauth]
Sep 02 09:16:48 rmg-vpn-01 sshd[23637]: Invalid user test from 203.0.113.90 port 41668
Sep 02 09:16:49 rmg-vpn-01 sshd[23637]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:16:49 rmg-vpn-01 sshd[23637]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:16:51 rmg-vpn-01 sshd[23637]: Failed password for invalid user test from 203.0.113.90 port 41668 ssh2
Sep 02 09:16:52 rmg-vpn-01 sshd[23637]: Connection closed by invalid user test 203.0.113.90 port 41668 [preauth]
Sep 02 09:16:58 rmg-vpn-01 sshd[23641]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12  user=root
Sep 02 09:17:00 rmg-vpn-01 sshd[23641]: Failed password for root from 203.0.113.12 port 51179 ssh2
Sep 02 09:17:01 rmg-vpn-01 CRON[20049]: pam_unix(cron:session): session opened for user root(uid=0) by (uid=0)
Sep 02 09:17:01 rmg-vpn-01 CRON[19624]: pam_unix(cron:session): session closed for user root
Sep 02 09:17:03 rmg-vpn-01 sshd[23648]: Invalid user ubuntu from 203.0.113.90 port 36844
Sep 02 09:17:04 rmg-vpn-01 sshd[23648]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:17:04 rmg-vpn-01 sshd[23648]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:17:06 rmg-vpn-01 sshd[23648]: Failed password for invalid user ubuntu from 203.0.113.90 port 36844 ssh2
Sep 02 09:17:07 rmg-vpn-01 sshd[23648]: Connection closed by invalid user ubuntu 203.0.113.90 port 36844 [preauth]
Sep 02 09:17:14 rmg-vpn-01 sshd[23649]: Invalid user git from 203.0.113.90 port 44531
Sep 02 09:17:15 rmg-vpn-01 sshd[23649]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:17:15 rmg-vpn-01 sshd[23649]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:17:17 rmg-vpn-01 sshd[23649]: Failed password for invalid user git from 203.0.113.90 port 44531 ssh2
Sep 02 09:17:18 rmg-vpn-01 sshd[23649]: Connection closed by invalid user git 203.0.113.90 port 44531 [preauth]
Sep 02 09:17:23 rmg-vpn-01 sshd[23654]: Invalid user deploy from 203.0.113.90 port 60183
Sep 02 09:17:24 rmg-vpn-01 sshd[23654]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:17:24 rmg-vpn-01 sshd[23654]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:17:26 rmg-vpn-01 sshd[23654]: Failed password for invalid user deploy from 203.0.113.90 port 60183 ssh2
Sep 02 09:17:27 rmg-vpn-01 sshd[23654]: Connection closed by invalid user deploy 203.0.113.90 port 60183 [preauth]
Sep 02 09:17:27 rmg-vpn-01 sshd[23658]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90  user=postgres
Sep 02 09:17:29 rmg-vpn-01 sshd[23658]: Failed password for postgres from 203.0.113.90 port 38348 ssh2
Sep 02 09:17:32 rmg-vpn-01 sshd[23660]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90  user=root
Sep 02 09:17:34 rmg-vpn-01 sshd[23660]: Failed password for root from 203.0.113.90 port 46744 ssh2
Sep 02 09:17:37 rmg-vpn-01 sshd[23667]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90  user=postgres
Sep 02 09:17:39 rmg-vpn-01 sshd[23667]: Failed password for postgres from 203.0.113.90 port 54980 ssh2
Sep 02 09:17:41 rmg-vpn-01 sshd[23669]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90  user=postgres
Sep 02 09:17:43 rmg-vpn-01 sshd[23669]: Failed password for postgres from 203.0.113.90 port 61854 ssh2
Sep 02 09:17:47 rmg-vpn-01 sshd[23672]: Invalid user oracle from 203.0.113.88 port 40108
Sep 02 09:17:48 rmg-vpn-01 sshd[23672]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:17:48 rmg-vpn-01 sshd[23672]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.88
Sep 02 09:17:50 rmg-vpn-01 sshd[23672]: Failed password for invalid user oracle from 203.0.113.88 port 40108 ssh2
Sep 02 09:17:51 rmg-vpn-01 sshd[23672]: Connection closed by invalid user oracle 203.0.113.88 port 40108 [preauth]
Sep 02 09:17:52 rmg-vpn-01 sshd[23675]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.77  user=jdelacruz
Sep 02 09:17:54 rmg-vpn-01 sshd[23675]: Failed password for jdelacruz from 198.51.100.77 port 60135 ssh2
Sep 02 09:17:55 rmg-vpn-01 sshd[23681]: Invalid user oracle from 203.0.113.90 port 61960
Sep 02 09:17:56 rmg-vpn-01 sshd[23681]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:17:56 rmg-vpn-01 sshd[23681]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:17:58 rmg-vpn-01 sshd[23681]: Failed password for invalid user oracle from 203.0.113.90 port 61960 ssh2
Sep 02 09:17:59 rmg-vpn-01 sshd[23681]: Connection closed by invalid user oracle 203.0.113.90 port 61960 [preauth]
Sep 02 09:18:00 rmg-vpn-01 sshd[23688]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90  user=root
Sep 02 09:18:02 rmg-vpn-01 sshd[23688]: Failed password for root from 203.0.113.90 port 54844 ssh2
Sep 02 09:18:10 rmg-vpn-01 sshd[23690]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90  user=postgres
Sep 02 09:18:12 rmg-vpn-01 sshd[23690]: Failed password for postgres from 203.0.113.90 port 50129 ssh2
Sep 02 09:18:15 rmg-vpn-01 sshd[23699]: Invalid user admin from 203.0.113.88 port 42784
Sep 02 09:18:16 rmg-vpn-01 sshd[23699]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:18:16 rmg-vpn-01 sshd[23699]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.88
Sep 02 09:18:18 rmg-vpn-01 sshd[23699]: Failed password for invalid user admin from 203.0.113.88 port 42784 ssh2
Sep 02 09:18:19 rmg-vpn-01 sshd[23699]: Connection closed by invalid user admin 203.0.113.88 port 42784 [preauth]
Sep 02 09:18:19 rmg-vpn-01 sshd[23701]: Invalid user test from 203.0.113.90 port 50878
Sep 02 09:18:20 rmg-vpn-01 sshd[23701]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:18:20 rmg-vpn-01 sshd[23701]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:18:22 rmg-vpn-01 sshd[23701]: Failed password for invalid user test from 203.0.113.90 port 50878 ssh2
Sep 02 09:18:23 rmg-vpn-01 sshd[23701]: Connection closed by invalid user test 203.0.113.90 port 50878 [preauth]
Sep 02 09:18:27 rmg-vpn-01 sshd[23703]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90  user=jdelacruz
Sep 02 09:18:29 rmg-vpn-01 sshd[23703]: Failed password for jdelacruz from 203.0.113.90 port 44868 ssh2
Sep 02 09:18:32 rmg-vpn-01 sshd[23709]: Invalid user deploy from 203.0.113.88 port 37071
Sep 02 09:18:33 rmg-vpn-01 sshd[23709]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:18:33 rmg-vpn-01 sshd[23709]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.88
Sep 02 09:18:35 rmg-vpn-01 sshd[23709]: Failed password for invalid user deploy from 203.0.113.88 port 37071 ssh2
Sep 02 09:18:36 rmg-vpn-01 sshd[23709]: Connection closed by invalid user deploy 203.0.113.88 port 37071 [preauth]
Sep 02 09:18:37 rmg-vpn-01 sshd[23715]: Invalid user ubuntu from 203.0.113.90 port 38641
Sep 02 09:18:38 rmg-vpn-01 sshd[23715]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:18:38 rmg-vpn-01 sshd[23715]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:18:40 rmg-vpn-01 sshd[23715]: Failed password for invalid user ubuntu from 203.0.113.90 port 38641 ssh2
Sep 02 09:18:41 rmg-vpn-01 sshd[23715]: Connection closed by invalid user ubuntu 203.0.113.90 port 38641 [preauth]
Sep 02 09:18:46 rmg-vpn-01 sshd[23724]: Invalid user oracle from 203.0.113.88 port 31963
Sep 02 09:18:47 rmg-vpn-01 sshd[23724]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:18:47 rmg-vpn-01 sshd[23724]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.88
Sep 02 09:18:49 rmg-vpn-01 sshd[23724]: Failed password for invalid user oracle from 203.0.113.88 port 31963 ssh2
Sep 02 09:18:50 rmg-vpn-01 sshd[23724]: Connection closed by invalid user oracle 203.0.113.88 port 31963 [preauth]
Sep 02 09:18:55 rmg-vpn-01 sshd[23726]: Invalid user test from 203.0.113.90 port 30455
Sep 02 09:18:56 rmg-vpn-01 sshd[23726]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:18:56 rmg-vpn-01 sshd[23726]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:18:58 rmg-vpn-01 sshd[23726]: Failed password for invalid user test from 203.0.113.90 port 30455 ssh2
Sep 02 09:18:59 rmg-vpn-01 sshd[23726]: Connection closed by invalid user test 203.0.113.90 port 30455 [preauth]
Sep 02 09:18:59 rmg-vpn-01 sshd[23731]: Invalid user git from 203.0.113.90 port 55084
Sep 02 09:19:00 rmg-vpn-01 sshd[23731]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:19:00 rmg-vpn-01 sshd[23731]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:19:02 rmg-vpn-01 sshd[23731]: Failed password for invalid user git from 203.0.113.90 port 55084 ssh2
Sep 02 09:19:03 rmg-vpn-01 sshd[23731]: Connection closed by invalid user git 203.0.113.90 port 55084 [preauth]
Sep 02 09:19:09 rmg-vpn-01 sshd[23735]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12  user=jdelacruz
Sep 02 09:19:11 rmg-vpn-01 sshd[23735]: Failed password for jdelacruz from 203.0.113.12 port 64857 ssh2
Sep 02 09:19:19 rmg-vpn-01 sshd[23737]: Invalid user oracle from 203.0.113.90 port 55181
Sep 02 09:19:20 rmg-vpn-01 sshd[23737]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:19:20 rmg-vpn-01 sshd[23737]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:19:22 rmg-vpn-01 sshd[23737]: Failed password for invalid user oracle from 203.0.113.90 port 55181 ssh2
Sep 02 09:19:23 rmg-vpn-01 sshd[23737]: Connection closed by invalid user oracle 203.0.113.90 port 55181 [preauth]
Sep 02 09:19:24 rmg-vpn-01 sshd[23741]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.77  user=postgres
Sep 02 09:19:26 rmg-vpn-01 sshd[23741]: Failed password for postgres from 198.51.100.77 port 46552 ssh2
Sep 02 09:19:28 rmg-vpn-01 sshd[23745]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90  user=jdelacruz
Sep 02 09:19:30 rmg-vpn-01 sshd[23745]: Failed password for jdelacruz from 203.0.113.90 port 38394 ssh2
Sep 02 09:19:31 rmg-vpn-01 sshd[23750]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90  user=jdelacruz
Sep 02 09:19:33 rmg-vpn-01 sshd[23750]: Failed password for jdelacruz from 203.0.113.90 port 57437 ssh2
Sep 02 09:19:36 rmg-vpn-01 sshd[23755]: Invalid user oracle from 198.51.100.77 port 54148
Sep 02 09:19:37 rmg-vpn-01 sshd[23755]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:19:37 rmg-vpn-01 sshd[23755]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.77
Sep 02 09:19:39 rmg-vpn-01 sshd[23755]: Failed password for invalid user oracle from 198.51.100.77 port 54148 ssh2
Sep 02 09:19:40 rmg-vpn-01 sshd[23755]: Connection closed by invalid user oracle 198.51.100.77 port 54148 [preauth]
Sep 02 09:19:44 rmg-vpn-01 sshd[23759]: Invalid user git from 203.0.113.90 port 53636
Sep 02 09:19:45 rmg-vpn-01 sshd[23759]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:19:45 rmg-vpn-01 sshd[23759]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:19:47 rmg-vpn-01 sshd[23759]: Failed password for invalid user git from 203.0.113.90 port 53636 ssh2
Sep 02 09:19:48 rmg-vpn-01 sshd[23759]: Connection closed by invalid user git 203.0.113.90 port 53636 [preauth]
Sep 02 09:19:50 rmg-vpn-01 sshd[23761]: Invalid user git from 203.0.113.90 port 62566
Sep 02 09:19:51 rmg-vpn-01 sshd[23761]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:19:51 rmg-vpn-01 sshd[23761]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:19:53 rmg-vpn-01 sshd[23761]: Failed password for invalid user git from 203.0.113.90 port 62566 ssh2
Sep 02 09:19:54 rmg-vpn-01 sshd[23761]: Connection closed by invalid user git 203.0.113.90 port 62566 [preauth]
Sep 02 09:19:57 rmg-vpn-01 sshd[23765]: Invalid user ubuntu from 203.0.113.90 port 54259
Sep 02 09:19:58 rmg-vpn-01 sshd[23765]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:19:58 rmg-vpn-01 sshd[23765]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:20:00 rmg-vpn-01 sshd[23765]: Failed password for invalid user ubuntu from 203.0.113.90 port 54259 ssh2
Sep 02 09:20:01 rmg-vpn-01 sshd[21989]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 09:20:01 rmg-vpn-01 sshd[23765]: Connection closed by invalid user ubuntu 203.0.113.90 port 54259 [preauth]
Sep 02 09:20:01 rmg-vpn-01 sshd[23766]: Invalid user deploy from 203.0.113.90 port 34696
Sep 02 09:20:02 rmg-vpn-01 sshd[23766]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:20:02 rmg-vpn-01 sshd[23766]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:20:03 rmg-vpn-01 sshd[21989]: Failed password for nagios from 10.20.9.40 port 54070 ssh2
Sep 02 09:20:04 rmg-vpn-01 sshd[23766]: Failed password for invalid user deploy from 203.0.113.90 port 34696 ssh2
Sep 02 09:20:05 rmg-vpn-01 sshd[23766]: Connection closed by invalid user deploy 203.0.113.90 port 34696 [preauth]
Sep 02 09:20:06 rmg-vpn-01 sshd[23770]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90  user=root
Sep 02 09:20:08 rmg-vpn-01 sshd[23770]: Failed password for root from 203.0.113.90 port 31864 ssh2
Sep 02 09:20:12 rmg-vpn-01 sshd[23778]: Invalid user git from 203.0.113.90 port 58290
Sep 02 09:20:13 rmg-vpn-01 sshd[23778]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:20:13 rmg-vpn-01 sshd[23778]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:20:15 rmg-vpn-01 sshd[23778]: Failed password for invalid user git from 203.0.113.90 port 58290 ssh2
Sep 02 09:20:16 rmg-vpn-01 sshd[23778]: Connection closed by invalid user git 203.0.113.90 port 58290 [preauth]
Sep 02 09:20:20 rmg-vpn-01 sshd[23782]: Invalid user ubuntu from 203.0.113.90 port 36285
Sep 02 09:20:21 rmg-vpn-01 sshd[23782]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:20:21 rmg-vpn-01 sshd[23782]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:20:23 rmg-vpn-01 sshd[23782]: Failed password for invalid user ubuntu from 203.0.113.90 port 36285 ssh2
Sep 02 09:20:24 rmg-vpn-01 sshd[23782]: Connection closed by invalid user ubuntu 203.0.113.90 port 36285 [preauth]
Sep 02 09:20:26 rmg-vpn-01 sshd[23786]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90  user=postgres
Sep 02 09:20:28 rmg-vpn-01 sshd[23786]: Failed password for postgres from 203.0.113.90 port 53260 ssh2
Sep 02 09:20:29 rmg-vpn-01 sshd[23790]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90  user=postgres
Sep 02 09:20:31 rmg-vpn-01 sshd[23790]: Failed password for postgres from 203.0.113.90 port 41461 ssh2
Sep 02 09:20:35 rmg-vpn-01 sshd[23793]: Invalid user admin from 203.0.113.90 port 30046
Sep 02 09:20:36 rmg-vpn-01 sshd[23793]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:20:36 rmg-vpn-01 sshd[23793]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:20:38 rmg-vpn-01 sshd[23793]: Failed password for invalid user admin from 203.0.113.90 port 30046 ssh2
Sep 02 09:20:39 rmg-vpn-01 sshd[23793]: Connection closed by invalid user admin 203.0.113.90 port 30046 [preauth]
Sep 02 09:20:41 rmg-vpn-01 sshd[23801]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.88  user=jdelacruz
Sep 02 09:20:43 rmg-vpn-01 sshd[23801]: Failed password for jdelacruz from 203.0.113.88 port 47176 ssh2
Sep 02 09:20:46 rmg-vpn-01 sshd[23805]: Invalid user admin from 203.0.113.88 port 62745
Sep 02 09:20:47 rmg-vpn-01 sshd[23805]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:20:47 rmg-vpn-01 sshd[23805]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.88
Sep 02 09:20:49 rmg-vpn-01 sshd[23805]: Failed password for invalid user admin from 203.0.113.88 port 62745 ssh2
Sep 02 09:20:50 rmg-vpn-01 sshd[23805]: Connection closed by invalid user admin 203.0.113.88 port 62745 [preauth]
Sep 02 09:20:56 rmg-vpn-01 sshd[23810]: Invalid user admin from 203.0.113.12 port 43275
Sep 02 09:20:57 rmg-vpn-01 sshd[23810]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:20:57 rmg-vpn-01 sshd[23810]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12
Sep 02 09:20:59 rmg-vpn-01 sshd[23810]: Failed password for invalid user admin from 203.0.113.12 port 43275 ssh2
Sep 02 09:21:00 rmg-vpn-01 sshd[23810]: Connection closed by invalid user admin 203.0.113.12 port 43275 [preauth]
Sep 02 09:21:04 rmg-vpn-01 sshd[23814]: Invalid user deploy from 203.0.113.88 port 58647
Sep 02 09:21:05 rmg-vpn-01 sshd[23814]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:21:05 rmg-vpn-01 sshd[23814]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.88
Sep 02 09:21:07 rmg-vpn-01 sshd[23814]: Failed password for invalid user deploy from 203.0.113.88 port 58647 ssh2
Sep 02 09:21:07 rmg-vpn-01 sshd[23822]: Invalid user test from 203.0.113.90 port 45227
Sep 02 09:21:08 rmg-vpn-01 sshd[23814]: Connection closed by invalid user deploy 203.0.113.88 port 58647 [preauth]
Sep 02 09:21:08 rmg-vpn-01 sshd[23822]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:21:08 rmg-vpn-01 sshd[23822]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:21:10 rmg-vpn-01 sshd[23822]: Failed password for invalid user test from 203.0.113.90 port 45227 ssh2
Sep 02 09:21:11 rmg-vpn-01 sshd[23822]: Connection closed by invalid user test 203.0.113.90 port 45227 [preauth]
Sep 02 09:21:17 rmg-vpn-01 sshd[23831]: Invalid user oracle from 198.51.100.77 port 46465
Sep 02 09:21:18 rmg-vpn-01 sshd[23831]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:21:18 rmg-vpn-01 sshd[23831]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.77
Sep 02 09:21:20 rmg-vpn-01 sshd[23831]: Failed password for invalid user oracle from 198.51.100.77 port 46465 ssh2
Sep 02 09:21:21 rmg-vpn-01 sshd[23831]: Connection closed by invalid user oracle 198.51.100.77 port 46465 [preauth]
Sep 02 09:21:21 rmg-vpn-01 sshd[23836]: Invalid user oracle from 203.0.113.90 port 50982
Sep 02 09:21:22 rmg-vpn-01 sshd[23836]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:21:22 rmg-vpn-01 sshd[23836]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:21:24 rmg-vpn-01 sshd[23836]: Failed password for invalid user oracle from 203.0.113.90 port 50982 ssh2
Sep 02 09:21:25 rmg-vpn-01 sshd[23836]: Connection closed by invalid user oracle 203.0.113.90 port 50982 [preauth]
Sep 02 09:21:29 rmg-vpn-01 sshd[23845]: Invalid user deploy from 203.0.113.90 port 53522
Sep 02 09:21:30 rmg-vpn-01 sshd[23845]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:21:30 rmg-vpn-01 sshd[23845]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:21:32 rmg-vpn-01 sshd[23845]: Failed password for invalid user deploy from 203.0.113.90 port 53522 ssh2
Sep 02 09:21:33 rmg-vpn-01 sshd[23845]: Connection closed by invalid user deploy 203.0.113.90 port 53522 [preauth]
Sep 02 09:21:40 rmg-vpn-01 sshd[23847]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90  user=postgres
Sep 02 09:21:42 rmg-vpn-01 sshd[23847]: Failed password for postgres from 203.0.113.90 port 45505 ssh2
Sep 02 09:21:44 rmg-vpn-01 sshd[23851]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12  user=postgres
Sep 02 09:21:46 rmg-vpn-01 sshd[23851]: Failed password for postgres from 203.0.113.12 port 33506 ssh2
Sep 02 09:21:54 rmg-vpn-01 sshd[23853]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90  user=root
Sep 02 09:21:56 rmg-vpn-01 sshd[23853]: Failed password for root from 203.0.113.90 port 33286 ssh2
Sep 02 09:22:03 rmg-vpn-01 sshd[23854]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90  user=jdelacruz
Sep 02 09:22:05 rmg-vpn-01 sshd[23854]: Failed password for jdelacruz from 203.0.113.90 port 52534 ssh2
Sep 02 09:22:10 rmg-vpn-01 sshd[23857]: Invalid user admin from 203.0.113.90 port 44561
Sep 02 09:22:11 rmg-vpn-01 sshd[23857]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:22:11 rmg-vpn-01 sshd[23857]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:22:13 rmg-vpn-01 sshd[23857]: Failed password for invalid user admin from 203.0.113.90 port 44561 ssh2
Sep 02 09:22:14 rmg-vpn-01 sshd[23857]: Connection closed by invalid user admin 203.0.113.90 port 44561 [preauth]
Sep 02 09:22:19 rmg-vpn-01 sshd[23858]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.77  user=jdelacruz
Sep 02 09:22:21 rmg-vpn-01 sshd[23858]: Failed password for jdelacruz from 198.51.100.77 port 35266 ssh2
Sep 02 09:22:23 rmg-vpn-01 sshd[23859]: Invalid user deploy from 203.0.113.12 port 47218
Sep 02 09:22:24 rmg-vpn-01 sshd[23859]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:22:24 rmg-vpn-01 sshd[23859]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12
Sep 02 09:22:26 rmg-vpn-01 sshd[23859]: Failed password for invalid user deploy from 203.0.113.12 port 47218 ssh2
Sep 02 09:22:27 rmg-vpn-01 sshd[23859]: Connection closed by invalid user deploy 203.0.113.12 port 47218 [preauth]
Sep 02 09:22:33 rmg-vpn-01 sshd[23868]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90  user=root
Sep 02 09:22:35 rmg-vpn-01 sshd[23868]: Failed password for root from 203.0.113.90 port 39129 ssh2
Sep 02 09:22:42 rmg-vpn-01 sshd[23870]: Invalid user admin from 203.0.113.90 port 52378
Sep 02 09:22:43 rmg-vpn-01 sshd[23870]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:22:43 rmg-vpn-01 sshd[23870]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:22:45 rmg-vpn-01 sshd[23870]: Failed password for invalid user admin from 203.0.113.90 port 52378 ssh2
Sep 02 09:22:46 rmg-vpn-01 sshd[23870]: Connection closed by invalid user admin 203.0.113.90 port 52378 [preauth]
Sep 02 09:22:53 rmg-vpn-01 sshd[23872]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90  user=root
Sep 02 09:22:55 rmg-vpn-01 sshd[23872]: Failed password for root from 203.0.113.90 port 62496 ssh2
Sep 02 09:22:58 rmg-vpn-01 sshd[23874]: Invalid user admin from 203.0.113.12 port 36848
Sep 02 09:22:59 rmg-vpn-01 sshd[23874]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:22:59 rmg-vpn-01 sshd[23874]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12
Sep 02 09:23:01 rmg-vpn-01 sshd[23874]: Failed password for invalid user admin from 203.0.113.12 port 36848 ssh2
Sep 02 09:23:02 rmg-vpn-01 sshd[23874]: Connection closed by invalid user admin 203.0.113.12 port 36848 [preauth]
Sep 02 09:23:06 rmg-vpn-01 sshd[23879]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90  user=postgres
Sep 02 09:23:08 rmg-vpn-01 sshd[23879]: Failed password for postgres from 203.0.113.90 port 41951 ssh2
Sep 02 09:23:14 rmg-vpn-01 sshd[23887]: Invalid user test from 203.0.113.90 port 54741
Sep 02 09:23:15 rmg-vpn-01 sshd[23887]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:23:15 rmg-vpn-01 sshd[23887]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:23:17 rmg-vpn-01 sshd[23887]: Failed password for invalid user test from 203.0.113.90 port 54741 ssh2
Sep 02 09:23:18 rmg-vpn-01 sshd[23887]: Connection closed by invalid user test 203.0.113.90 port 54741 [preauth]
Sep 02 09:23:19 rmg-vpn-01 sshd[23889]: Invalid user git from 203.0.113.90 port 45489
Sep 02 09:23:20 rmg-vpn-01 sshd[23889]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:23:20 rmg-vpn-01 sshd[23889]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:23:22 rmg-vpn-01 sshd[23889]: Failed password for invalid user git from 203.0.113.90 port 45489 ssh2
Sep 02 09:23:23 rmg-vpn-01 sshd[23889]: Connection closed by invalid user git 203.0.113.90 port 45489 [preauth]
Sep 02 09:23:27 rmg-vpn-01 sshd[23890]: Invalid user admin from 203.0.113.88 port 31636
Sep 02 09:23:28 rmg-vpn-01 sshd[23890]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:23:28 rmg-vpn-01 sshd[23890]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.88
Sep 02 09:23:30 rmg-vpn-01 sshd[23890]: Failed password for invalid user admin from 203.0.113.88 port 31636 ssh2
Sep 02 09:23:31 rmg-vpn-01 sshd[23890]: Connection closed by invalid user admin 203.0.113.88 port 31636 [preauth]
Sep 02 09:23:38 rmg-vpn-01 sshd[23899]: Invalid user git from 203.0.113.90 port 54917
Sep 02 09:23:39 rmg-vpn-01 sshd[23899]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:23:39 rmg-vpn-01 sshd[23899]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:23:41 rmg-vpn-01 sshd[23899]: Failed password for invalid user git from 203.0.113.90 port 54917 ssh2
Sep 02 09:23:42 rmg-vpn-01 sshd[23899]: Connection closed by invalid user git 203.0.113.90 port 54917 [preauth]
Sep 02 09:23:46 rmg-vpn-01 sshd[23902]: Invalid user deploy from 203.0.113.90 port 63661
Sep 02 09:23:47 rmg-vpn-01 sshd[23902]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:23:47 rmg-vpn-01 sshd[23902]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:23:49 rmg-vpn-01 sshd[23902]: Failed password for invalid user deploy from 203.0.113.90 port 63661 ssh2
Sep 02 09:23:50 rmg-vpn-01 sshd[23902]: Connection closed by invalid user deploy 203.0.113.90 port 63661 [preauth]
Sep 02 09:23:57 rmg-vpn-01 sshd[23910]: Invalid user test from 203.0.113.88 port 37309
Sep 02 09:23:58 rmg-vpn-01 sshd[23910]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:23:58 rmg-vpn-01 sshd[23910]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.88
Sep 02 09:24:00 rmg-vpn-01 sshd[23910]: Failed password for invalid user test from 203.0.113.88 port 37309 ssh2
Sep 02 09:24:01 rmg-vpn-01 sshd[23910]: Connection closed by invalid user test 203.0.113.88 port 37309 [preauth]
Sep 02 09:24:02 rmg-vpn-01 sshd[23918]: Invalid user deploy from 203.0.113.88 port 55515
Sep 02 09:24:03 rmg-vpn-01 sshd[23918]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:24:03 rmg-vpn-01 sshd[23918]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.88
Sep 02 09:24:05 rmg-vpn-01 sshd[23918]: Failed password for invalid user deploy from 203.0.113.88 port 55515 ssh2
Sep 02 09:24:06 rmg-vpn-01 sshd[23918]: Connection closed by invalid user deploy 203.0.113.88 port 55515 [preauth]
Sep 02 09:24:07 rmg-vpn-01 sshd[23922]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12  user=root
Sep 02 09:24:09 rmg-vpn-01 sshd[23922]: Failed password for root from 203.0.113.12 port 50669 ssh2
Sep 02 09:24:10 rmg-vpn-01 sshd[23923]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12  user=jdelacruz
Sep 02 09:24:12 rmg-vpn-01 sshd[23923]: Failed password for jdelacruz from 203.0.113.12 port 44624 ssh2
Sep 02 09:24:15 rmg-vpn-01 sshd[23924]: Invalid user admin from 198.51.100.77 port 61143
Sep 02 09:24:16 rmg-vpn-01 sshd[23924]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:24:16 rmg-vpn-01 sshd[23924]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.77
Sep 02 09:24:18 rmg-vpn-01 sshd[23924]: Failed password for invalid user admin from 198.51.100.77 port 61143 ssh2
Sep 02 09:24:19 rmg-vpn-01 sshd[23924]: Connection closed by invalid user admin 198.51.100.77 port 61143 [preauth]
Sep 02 09:24:23 rmg-vpn-01 sshd[23926]: Invalid user git from 203.0.113.90 port 64026
Sep 02 09:24:24 rmg-vpn-01 sshd[23926]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:24:24 rmg-vpn-01 sshd[23926]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:24:26 rmg-vpn-01 sshd[23926]: Failed password for invalid user git from 203.0.113.90 port 64026 ssh2
Sep 02 09:24:27 rmg-vpn-01 sshd[23926]: Connection closed by invalid user git 203.0.113.90 port 64026 [preauth]
Sep 02 09:24:28 rmg-vpn-01 sshd[23927]: Invalid user git from 203.0.113.90 port 45252
Sep 02 09:24:29 rmg-vpn-01 sshd[23927]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:24:29 rmg-vpn-01 sshd[23927]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:24:31 rmg-vpn-01 sshd[23927]: Failed password for invalid user git from 203.0.113.90 port 45252 ssh2
Sep 02 09:24:32 rmg-vpn-01 sshd[23927]: Connection closed by invalid user git 203.0.113.90 port 45252 [preauth]
Sep 02 09:24:36 rmg-vpn-01 sshd[23929]: Invalid user ubuntu from 203.0.113.90 port 57174
Sep 02 09:24:37 rmg-vpn-01 sshd[23929]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:24:37 rmg-vpn-01 sshd[23929]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:24:39 rmg-vpn-01 sshd[23929]: Failed password for invalid user ubuntu from 203.0.113.90 port 57174 ssh2
Sep 02 09:24:40 rmg-vpn-01 sshd[23929]: Connection closed by invalid user ubuntu 203.0.113.90 port 57174 [preauth]
Sep 02 09:24:46 rmg-vpn-01 sshd[23933]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90  user=root
Sep 02 09:24:48 rmg-vpn-01 sshd[23933]: Failed password for root from 203.0.113.90 port 30590 ssh2
Sep 02 09:24:50 rmg-vpn-01 sshd[23934]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.77  user=jdelacruz
Sep 02 09:24:52 rmg-vpn-01 sshd[23934]: Failed password for jdelacruz from 198.51.100.77 port 55780 ssh2
Sep 02 09:24:55 rmg-vpn-01 sshd[23940]: Invalid user admin from 198.51.100.77 port 32976
Sep 02 09:24:56 rmg-vpn-01 sshd[23940]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:24:56 rmg-vpn-01 sshd[23940]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.77
Sep 02 09:24:58 rmg-vpn-01 sshd[23940]: Failed password for invalid user admin from 198.51.100.77 port 32976 ssh2
Sep 02 09:24:59 rmg-vpn-01 sshd[23940]: Connection closed by invalid user admin 198.51.100.77 port 32976 [preauth]
Sep 02 09:25:01 rmg-vpn-01 sshd[23942]: Invalid user ubuntu from 203.0.113.90 port 63936
Sep 02 09:25:02 rmg-vpn-01 sshd[23942]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:25:02 rmg-vpn-01 sshd[23942]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:25:04 rmg-vpn-01 sshd[23942]: Failed password for invalid user ubuntu from 203.0.113.90 port 63936 ssh2
Sep 02 09:25:05 rmg-vpn-01 sshd[23942]: Connection closed by invalid user ubuntu 203.0.113.90 port 63936 [preauth]
Sep 02 09:25:05 rmg-vpn-01 sshd[23945]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90  user=jdelacruz
Sep 02 09:25:07 rmg-vpn-01 sshd[23945]: Failed password for jdelacruz from 203.0.113.90 port 47858 ssh2
Sep 02 09:25:09 rmg-vpn-01 sshd[23950]: Invalid user oracle from 203.0.113.90 port 45566
Sep 02 09:25:10 rmg-vpn-01 sshd[23950]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:25:10 rmg-vpn-01 sshd[23950]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:25:12 rmg-vpn-01 sshd[23950]: Failed password for invalid user oracle from 203.0.113.90 port 45566 ssh2
Sep 02 09:25:13 rmg-vpn-01 sshd[21996]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 09:25:13 rmg-vpn-01 sshd[23950]: Connection closed by invalid user oracle 203.0.113.90 port 45566 [preauth]
Sep 02 09:25:13 rmg-vpn-01 sshd[23957]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90  user=jdelacruz
Sep 02 09:25:15 rmg-vpn-01 sshd[21996]: Failed password for nagios from 10.20.9.40 port 44886 ssh2
Sep 02 09:25:15 rmg-vpn-01 sshd[23957]: Failed password for jdelacruz from 203.0.113.90 port 30033 ssh2
Sep 02 09:25:24 rmg-vpn-01 sshd[23962]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90  user=jdelacruz
Sep 02 09:25:26 rmg-vpn-01 sshd[23962]: Failed password for jdelacruz from 203.0.113.90 port 55965 ssh2
Sep 02 09:25:27 rmg-vpn-01 sshd[23969]: Invalid user test from 203.0.113.12 port 60755
Sep 02 09:25:28 rmg-vpn-01 sshd[23969]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:25:28 rmg-vpn-01 sshd[23969]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12
Sep 02 09:25:30 rmg-vpn-01 sshd[23969]: Failed password for invalid user test from 203.0.113.12 port 60755 ssh2
Sep 02 09:25:31 rmg-vpn-01 sshd[23969]: Connection closed by invalid user test 203.0.113.12 port 60755 [preauth]
Sep 02 09:25:36 rmg-vpn-01 sshd[23971]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90  user=root
Sep 02 09:25:38 rmg-vpn-01 sshd[23971]: Failed password for root from 203.0.113.90 port 41053 ssh2
Sep 02 09:25:45 rmg-vpn-01 sshd[23980]: Invalid user deploy from 203.0.113.90 port 42118
Sep 02 09:25:46 rmg-vpn-01 sshd[23980]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:25:46 rmg-vpn-01 sshd[23980]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:25:48 rmg-vpn-01 sshd[23980]: Failed password for invalid user deploy from 203.0.113.90 port 42118 ssh2
Sep 02 09:25:49 rmg-vpn-01 sshd[23980]: Connection closed by invalid user deploy 203.0.113.90 port 42118 [preauth]
Sep 02 09:25:55 rmg-vpn-01 sshd[23983]: Invalid user oracle from 198.51.100.77 port 43716
Sep 02 09:25:56 rmg-vpn-01 sshd[23983]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:25:56 rmg-vpn-01 sshd[23983]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.77
Sep 02 09:25:58 rmg-vpn-01 sshd[23983]: Failed password for invalid user oracle from 198.51.100.77 port 43716 ssh2
Sep 02 09:25:59 rmg-vpn-01 sshd[23983]: Connection closed by invalid user oracle 198.51.100.77 port 43716 [preauth]
Sep 02 09:25:59 rmg-vpn-01 sshd[23990]: Invalid user admin from 203.0.113.90 port 57779
Sep 02 09:26:00 rmg-vpn-01 sshd[23990]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:26:00 rmg-vpn-01 sshd[23990]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:26:02 rmg-vpn-01 sshd[23990]: Failed password for invalid user admin from 203.0.113.90 port 57779 ssh2
Sep 02 09:26:03 rmg-vpn-01 sshd[23990]: Connection closed by invalid user admin 203.0.113.90 port 57779 [preauth]
Sep 02 09:26:07 rmg-vpn-01 sshd[23992]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12  user=postgres
Sep 02 09:26:09 rmg-vpn-01 sshd[23992]: Failed password for postgres from 203.0.113.12 port 53208 ssh2
Sep 02 09:26:18 rmg-vpn-01 sshd[23998]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.77  user=postgres
Sep 02 09:26:20 rmg-vpn-01 sshd[23998]: Failed password for postgres from 198.51.100.77 port 34369 ssh2
Sep 02 09:26:23 rmg-vpn-01 sshd[24004]: Invalid user test from 203.0.113.90 port 57557
Sep 02 09:26:24 rmg-vpn-01 sshd[24004]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:26:24 rmg-vpn-01 sshd[24004]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:26:26 rmg-vpn-01 sshd[24004]: Failed password for invalid user test from 203.0.113.90 port 57557 ssh2
Sep 02 09:26:27 rmg-vpn-01 sshd[24004]: Connection closed by invalid user test 203.0.113.90 port 57557 [preauth]
Sep 02 09:26:29 rmg-vpn-01 sshd[24012]: Invalid user test from 203.0.113.88 port 63919
Sep 02 09:26:30 rmg-vpn-01 sshd[24012]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:26:30 rmg-vpn-01 sshd[24012]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.88
Sep 02 09:26:32 rmg-vpn-01 sshd[24012]: Failed password for invalid user test from 203.0.113.88 port 63919 ssh2
Sep 02 09:26:33 rmg-vpn-01 sshd[24012]: Connection closed by invalid user test 203.0.113.88 port 63919 [preauth]
Sep 02 09:26:37 rmg-vpn-01 sshd[24017]: Invalid user admin from 203.0.113.90 port 32509
Sep 02 09:26:38 rmg-vpn-01 sshd[24017]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:26:38 rmg-vpn-01 sshd[24017]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:26:40 rmg-vpn-01 sshd[24017]: Failed password for invalid user admin from 203.0.113.90 port 32509 ssh2
Sep 02 09:26:40 rmg-vpn-01 sshd[24019]: Invalid user git from 203.0.113.90 port 54408
Sep 02 09:26:41 rmg-vpn-01 sshd[24017]: Connection closed by invalid user admin 203.0.113.90 port 32509 [preauth]
Sep 02 09:26:41 rmg-vpn-01 sshd[24019]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:26:41 rmg-vpn-01 sshd[24019]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:26:43 rmg-vpn-01 sshd[24019]: Failed password for invalid user git from 203.0.113.90 port 54408 ssh2
Sep 02 09:26:44 rmg-vpn-01 sshd[24019]: Connection closed by invalid user git 203.0.113.90 port 54408 [preauth]
Sep 02 09:26:49 rmg-vpn-01 sshd[24021]: Invalid user test from 203.0.113.88 port 32009
Sep 02 09:26:50 rmg-vpn-01 sshd[24021]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:26:50 rmg-vpn-01 sshd[24021]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.88
Sep 02 09:26:52 rmg-vpn-01 sshd[24021]: Failed password for invalid user test from 203.0.113.88 port 32009 ssh2
Sep 02 09:26:53 rmg-vpn-01 sshd[24021]: Connection closed by invalid user test 203.0.113.88 port 32009 [preauth]
Sep 02 09:26:59 rmg-vpn-01 sshd[24030]: Invalid user admin from 203.0.113.90 port 56397
Sep 02 09:27:00 rmg-vpn-01 sshd[24030]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:27:00 rmg-vpn-01 sshd[24030]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:27:02 rmg-vpn-01 sshd[24030]: Failed password for invalid user admin from 203.0.113.90 port 56397 ssh2
Sep 02 09:27:03 rmg-vpn-01 sshd[24030]: Connection closed by invalid user admin 203.0.113.90 port 56397 [preauth]
Sep 02 09:27:07 rmg-vpn-01 sshd[24036]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.77  user=jdelacruz
Sep 02 09:27:09 rmg-vpn-01 sshd[24036]: Failed password for jdelacruz from 198.51.100.77 port 38737 ssh2
Sep 02 09:27:15 rmg-vpn-01 sshd[24042]: Invalid user oracle from 203.0.113.88 port 41138
Sep 02 09:27:16 rmg-vpn-01 sshd[24042]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:27:16 rmg-vpn-01 sshd[24042]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.88
Sep 02 09:27:18 rmg-vpn-01 sshd[24042]: Failed password for invalid user oracle from 203.0.113.88 port 41138 ssh2
Sep 02 09:27:19 rmg-vpn-01 sshd[24042]: Connection closed by invalid user oracle 203.0.113.88 port 41138 [preauth]
Sep 02 09:27:20 rmg-vpn-01 sshd[24049]: Invalid user git from 203.0.113.90 port 31244
Sep 02 09:27:21 rmg-vpn-01 sshd[24049]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:27:21 rmg-vpn-01 sshd[24049]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:27:23 rmg-vpn-01 sshd[24049]: Failed password for invalid user git from 203.0.113.90 port 31244 ssh2
Sep 02 09:27:24 rmg-vpn-01 sshd[24049]: Connection closed by invalid user git 203.0.113.90 port 31244 [preauth]
Sep 02 09:27:24 rmg-vpn-01 sshd[24054]: Invalid user git from 203.0.113.90 port 33652
Sep 02 09:27:25 rmg-vpn-01 sshd[24054]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:27:25 rmg-vpn-01 sshd[24054]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:27:27 rmg-vpn-01 sshd[24054]: Failed password for invalid user git from 203.0.113.90 port 33652 ssh2
Sep 02 09:27:28 rmg-vpn-01 sshd[24054]: Connection closed by invalid user git 203.0.113.90 port 33652 [preauth]
Sep 02 09:27:30 rmg-vpn-01 sshd[24056]: Invalid user ubuntu from 203.0.113.90 port 48588
Sep 02 09:27:31 rmg-vpn-01 sshd[24056]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:27:31 rmg-vpn-01 sshd[24056]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:27:33 rmg-vpn-01 sshd[24056]: Failed password for invalid user ubuntu from 203.0.113.90 port 48588 ssh2
Sep 02 09:27:34 rmg-vpn-01 sshd[24056]: Connection closed by invalid user ubuntu 203.0.113.90 port 48588 [preauth]
Sep 02 09:27:37 rmg-vpn-01 sshd[24061]: Invalid user deploy from 203.0.113.90 port 45756
Sep 02 09:27:38 rmg-vpn-01 sshd[24061]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:27:38 rmg-vpn-01 sshd[24061]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:27:40 rmg-vpn-01 sshd[24061]: Failed password for invalid user deploy from 203.0.113.90 port 45756 ssh2
Sep 02 09:27:41 rmg-vpn-01 sshd[24061]: Connection closed by invalid user deploy 203.0.113.90 port 45756 [preauth]
Sep 02 09:27:42 rmg-vpn-01 sshd[24063]: Invalid user admin from 203.0.113.90 port 61631
Sep 02 09:27:43 rmg-vpn-01 sshd[24063]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:27:43 rmg-vpn-01 sshd[24063]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:27:45 rmg-vpn-01 sshd[24063]: Failed password for invalid user admin from 203.0.113.90 port 61631 ssh2
Sep 02 09:27:46 rmg-vpn-01 sshd[24063]: Connection closed by invalid user admin 203.0.113.90 port 61631 [preauth]
Sep 02 09:27:47 rmg-vpn-01 sshd[24066]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90  user=root
Sep 02 09:27:49 rmg-vpn-01 sshd[24066]: Failed password for root from 203.0.113.90 port 43107 ssh2
Sep 02 09:27:51 rmg-vpn-01 sshd[24072]: Invalid user deploy from 203.0.113.90 port 30731
Sep 02 09:27:52 rmg-vpn-01 sshd[24072]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:27:52 rmg-vpn-01 sshd[24072]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:27:54 rmg-vpn-01 sshd[24072]: Failed password for invalid user deploy from 203.0.113.90 port 30731 ssh2
Sep 02 09:27:54 rmg-vpn-01 sshd[24078]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90  user=postgres
Sep 02 09:27:55 rmg-vpn-01 sshd[24072]: Connection closed by invalid user deploy 203.0.113.90 port 30731 [preauth]
Sep 02 09:27:56 rmg-vpn-01 sshd[24078]: Failed password for postgres from 203.0.113.90 port 51292 ssh2
Sep 02 09:28:05 rmg-vpn-01 sshd[24082]: Invalid user test from 198.51.100.77 port 30509
Sep 02 09:28:06 rmg-vpn-01 sshd[24082]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:28:06 rmg-vpn-01 sshd[24082]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.77
Sep 02 09:28:08 rmg-vpn-01 sshd[24082]: Failed password for invalid user test from 198.51.100.77 port 30509 ssh2
Sep 02 09:28:09 rmg-vpn-01 sshd[24082]: Connection closed by invalid user test 198.51.100.77 port 30509 [preauth]
Sep 02 09:28:10 rmg-vpn-01 sshd[24086]: Invalid user ubuntu from 198.51.100.77 port 50165
Sep 02 09:28:11 rmg-vpn-01 sshd[24086]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:28:11 rmg-vpn-01 sshd[24086]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.77
Sep 02 09:28:13 rmg-vpn-01 sshd[24086]: Failed password for invalid user ubuntu from 198.51.100.77 port 50165 ssh2
Sep 02 09:28:14 rmg-vpn-01 sshd[24086]: Connection closed by invalid user ubuntu 198.51.100.77 port 50165 [preauth]
Sep 02 09:28:16 rmg-vpn-01 sshd[24090]: Invalid user oracle from 203.0.113.88 port 35364
Sep 02 09:28:17 rmg-vpn-01 sshd[24090]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:28:17 rmg-vpn-01 sshd[24090]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.88
Sep 02 09:28:19 rmg-vpn-01 sshd[24090]: Failed password for invalid user oracle from 203.0.113.88 port 35364 ssh2
Sep 02 09:28:20 rmg-vpn-01 sshd[24090]: Connection closed by invalid user oracle 203.0.113.88 port 35364 [preauth]
Sep 02 09:28:24 rmg-vpn-01 sshd[24097]: Invalid user test from 203.0.113.88 port 33130
Sep 02 09:28:25 rmg-vpn-01 sshd[24097]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:28:25 rmg-vpn-01 sshd[24097]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.88
Sep 02 09:28:27 rmg-vpn-01 sshd[24097]: Failed password for invalid user test from 203.0.113.88 port 33130 ssh2
Sep 02 09:28:28 rmg-vpn-01 sshd[24097]: Connection closed by invalid user test 203.0.113.88 port 33130 [preauth]
Sep 02 09:28:30 rmg-vpn-01 sshd[24099]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.77  user=root
Sep 02 09:28:32 rmg-vpn-01 sshd[24099]: Failed password for root from 198.51.100.77 port 59112 ssh2
Sep 02 09:28:37 rmg-vpn-01 sshd[24106]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90  user=postgres
Sep 02 09:28:39 rmg-vpn-01 sshd[24106]: Failed password for postgres from 203.0.113.90 port 51511 ssh2
Sep 02 09:28:40 rmg-vpn-01 sshd[24111]: Invalid user git from 198.51.100.77 port 54999
Sep 02 09:28:41 rmg-vpn-01 sshd[24111]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:28:41 rmg-vpn-01 sshd[24111]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.77
Sep 02 09:28:43 rmg-vpn-01 sshd[24111]: Failed password for invalid user git from 198.51.100.77 port 54999 ssh2
Sep 02 09:28:44 rmg-vpn-01 sshd[24111]: Connection closed by invalid user git 198.51.100.77 port 54999 [preauth]
Sep 02 09:28:44 rmg-vpn-01 sshd[24116]: Invalid user ubuntu from 203.0.113.90 port 61504
Sep 02 09:28:45 rmg-vpn-01 sshd[24116]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:28:45 rmg-vpn-01 sshd[24116]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:28:47 rmg-vpn-01 sshd[24116]: Failed password for invalid user ubuntu from 203.0.113.90 port 61504 ssh2
Sep 02 09:28:48 rmg-vpn-01 sshd[24116]: Connection closed by invalid user ubuntu 203.0.113.90 port 61504 [preauth]
Sep 02 09:28:49 rmg-vpn-01 sshd[24123]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90  user=root
Sep 02 09:28:51 rmg-vpn-01 sshd[24123]: Failed password for root from 203.0.113.90 port 31977 ssh2
Sep 02 09:28:54 rmg-vpn-01 sshd[24128]: Invalid user test from 203.0.113.90 port 61351
Sep 02 09:28:55 rmg-vpn-01 sshd[24128]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:28:55 rmg-vpn-01 sshd[24128]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:28:57 rmg-vpn-01 sshd[24128]: Failed password for invalid user test from 203.0.113.90 port 61351 ssh2
Sep 02 09:28:58 rmg-vpn-01 sshd[24128]: Connection closed by invalid user test 203.0.113.90 port 61351 [preauth]
Sep 02 09:29:00 rmg-vpn-01 sshd[24136]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12  user=root
Sep 02 09:29:02 rmg-vpn-01 sshd[24136]: Failed password for root from 203.0.113.12 port 64820 ssh2
Sep 02 09:29:10 rmg-vpn-01 sshd[24140]: Invalid user test from 203.0.113.90 port 61527
Sep 02 09:29:11 rmg-vpn-01 sshd[24140]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:29:11 rmg-vpn-01 sshd[24140]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:29:13 rmg-vpn-01 sshd[24140]: Failed password for invalid user test from 203.0.113.90 port 61527 ssh2
Sep 02 09:29:14 rmg-vpn-01 sshd[24140]: Connection closed by invalid user test 203.0.113.90 port 61527 [preauth]
Sep 02 09:29:15 rmg-vpn-01 sshd[24145]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90  user=root
Sep 02 09:29:17 rmg-vpn-01 sshd[24145]: Failed password for root from 203.0.113.90 port 49462 ssh2
Sep 02 09:29:24 rmg-vpn-01 sshd[24151]: Invalid user ubuntu from 203.0.113.90 port 50394
Sep 02 09:29:25 rmg-vpn-01 sshd[24151]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:29:25 rmg-vpn-01 sshd[24151]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:29:27 rmg-vpn-01 sshd[24151]: Failed password for invalid user ubuntu from 203.0.113.90 port 50394 ssh2
Sep 02 09:29:28 rmg-vpn-01 sshd[24151]: Connection closed by invalid user ubuntu 203.0.113.90 port 50394 [preauth]
Sep 02 09:29:28 rmg-vpn-01 sshd[24153]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90  user=postgres
Sep 02 09:29:30 rmg-vpn-01 sshd[24153]: Failed password for postgres from 203.0.113.90 port 60651 ssh2
Sep 02 09:29:33 rmg-vpn-01 sshd[24162]: Invalid user git from 203.0.113.90 port 40955
Sep 02 09:29:34 rmg-vpn-01 sshd[24162]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:29:34 rmg-vpn-01 sshd[24162]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:29:36 rmg-vpn-01 sshd[24162]: Failed password for invalid user git from 203.0.113.90 port 40955 ssh2
Sep 02 09:29:37 rmg-vpn-01 sshd[24162]: Connection closed by invalid user git 203.0.113.90 port 40955 [preauth]
Sep 02 09:29:42 rmg-vpn-01 sshd[24170]: Invalid user test from 203.0.113.90 port 37745
Sep 02 09:29:43 rmg-vpn-01 sshd[24170]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:29:43 rmg-vpn-01 sshd[24170]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:29:45 rmg-vpn-01 sshd[24170]: Failed password for invalid user test from 203.0.113.90 port 37745 ssh2
Sep 02 09:29:46 rmg-vpn-01 sshd[24170]: Connection closed by invalid user test 203.0.113.90 port 37745 [preauth]
Sep 02 09:29:51 rmg-vpn-01 sshd[24174]: Invalid user oracle from 203.0.113.90 port 46411
Sep 02 09:29:52 rmg-vpn-01 sshd[24174]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:29:52 rmg-vpn-01 sshd[24174]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:29:54 rmg-vpn-01 sshd[24174]: Failed password for invalid user oracle from 203.0.113.90 port 46411 ssh2
Sep 02 09:29:55 rmg-vpn-01 sshd[24174]: Connection closed by invalid user oracle 203.0.113.90 port 46411 [preauth]
Sep 02 09:29:57 rmg-vpn-01 sshd[24179]: Invalid user ubuntu from 203.0.113.90 port 62169
Sep 02 09:29:58 rmg-vpn-01 sshd[24179]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:29:58 rmg-vpn-01 sshd[24179]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:30:00 rmg-vpn-01 sshd[24179]: Failed password for invalid user ubuntu from 203.0.113.90 port 62169 ssh2
Sep 02 09:30:01 rmg-vpn-01 sshd[24179]: Connection closed by invalid user ubuntu 203.0.113.90 port 62169 [preauth]
Sep 02 09:30:06 rmg-vpn-01 sshd[24182]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90  user=jdelacruz
Sep 02 09:30:08 rmg-vpn-01 sshd[24182]: Failed password for jdelacruz from 203.0.113.90 port 52602 ssh2
Sep 02 09:30:13 rmg-vpn-01 sshd[21997]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 09:30:15 rmg-vpn-01 sshd[21997]: Failed password for nagios from 10.20.9.40 port 46121 ssh2
Sep 02 09:30:15 rmg-vpn-01 sshd[24183]: Invalid user git from 203.0.113.90 port 52179
Sep 02 09:30:16 rmg-vpn-01 sshd[24183]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:30:16 rmg-vpn-01 sshd[24183]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:30:18 rmg-vpn-01 sshd[24183]: Failed password for invalid user git from 203.0.113.90 port 52179 ssh2
Sep 02 09:30:19 rmg-vpn-01 sshd[24183]: Connection closed by invalid user git 203.0.113.90 port 52179 [preauth]
Sep 02 09:30:24 rmg-vpn-01 sshd[24192]: Invalid user test from 203.0.113.90 port 37521
Sep 02 09:30:25 rmg-vpn-01 sshd[24192]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:30:25 rmg-vpn-01 sshd[24192]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:30:27 rmg-vpn-01 sshd[24192]: Failed password for invalid user test from 203.0.113.90 port 37521 ssh2
Sep 02 09:30:28 rmg-vpn-01 sshd[24192]: Connection closed by invalid user test 203.0.113.90 port 37521 [preauth]
Sep 02 09:30:29 rmg-vpn-01 sshd[24201]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90  user=postgres
Sep 02 09:30:31 rmg-vpn-01 sshd[24201]: Failed password for postgres from 203.0.113.90 port 47339 ssh2
Sep 02 09:30:33 rmg-vpn-01 sshd[24206]: Invalid user git from 203.0.113.90 port 40549
Sep 02 09:30:34 rmg-vpn-01 sshd[24206]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:30:34 rmg-vpn-01 sshd[24206]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:30:36 rmg-vpn-01 sshd[24206]: Failed password for invalid user git from 203.0.113.90 port 40549 ssh2
Sep 02 09:30:37 rmg-vpn-01 sshd[24206]: Connection closed by invalid user git 203.0.113.90 port 40549 [preauth]
Sep 02 09:30:39 rmg-vpn-01 sshd[24209]: Invalid user ubuntu from 198.51.100.77 port 46557
Sep 02 09:30:40 rmg-vpn-01 sshd[24209]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:30:40 rmg-vpn-01 sshd[24209]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.77
Sep 02 09:30:42 rmg-vpn-01 sshd[24209]: Failed password for invalid user ubuntu from 198.51.100.77 port 46557 ssh2
Sep 02 09:30:43 rmg-vpn-01 sshd[24209]: Connection closed by invalid user ubuntu 198.51.100.77 port 46557 [preauth]
Sep 02 09:30:50 rmg-vpn-01 sshd[24210]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90  user=postgres
Sep 02 09:30:52 rmg-vpn-01 sshd[24210]: Failed password for postgres from 203.0.113.90 port 40554 ssh2
Sep 02 09:31:00 rmg-vpn-01 sshd[24216]: Invalid user deploy from 203.0.113.88 port 33256
Sep 02 09:31:01 rmg-vpn-01 sshd[24216]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:31:01 rmg-vpn-01 sshd[24216]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.88
Sep 02 09:31:03 rmg-vpn-01 sshd[24216]: Failed password for invalid user deploy from 203.0.113.88 port 33256 ssh2
Sep 02 09:31:04 rmg-vpn-01 sshd[24216]: Connection closed by invalid user deploy 203.0.113.88 port 33256 [preauth]
Sep 02 09:31:06 rmg-vpn-01 sshd[24220]: Invalid user test from 203.0.113.88 port 46290
Sep 02 09:31:07 rmg-vpn-01 sshd[24220]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:31:07 rmg-vpn-01 sshd[24220]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.88
Sep 02 09:31:09 rmg-vpn-01 sshd[24220]: Failed password for invalid user test from 203.0.113.88 port 46290 ssh2
Sep 02 09:31:10 rmg-vpn-01 sshd[24220]: Connection closed by invalid user test 203.0.113.88 port 46290 [preauth]
Sep 02 09:31:15 rmg-vpn-01 sshd[24221]: Invalid user admin from 198.51.100.77 port 31391
Sep 02 09:31:16 rmg-vpn-01 sshd[24221]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:31:16 rmg-vpn-01 sshd[24221]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.77
Sep 02 09:31:18 rmg-vpn-01 sshd[24221]: Failed password for invalid user admin from 198.51.100.77 port 31391 ssh2
Sep 02 09:31:19 rmg-vpn-01 sshd[24221]: Connection closed by invalid user admin 198.51.100.77 port 31391 [preauth]
Sep 02 09:31:21 rmg-vpn-01 sshd[24230]: Invalid user deploy from 198.51.100.77 port 64709
Sep 02 09:31:22 rmg-vpn-01 sshd[24230]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:31:22 rmg-vpn-01 sshd[24230]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.77
Sep 02 09:31:24 rmg-vpn-01 sshd[24230]: Failed password for invalid user deploy from 198.51.100.77 port 64709 ssh2
Sep 02 09:31:25 rmg-vpn-01 sshd[24230]: Connection closed by invalid user deploy 198.51.100.77 port 64709 [preauth]
Sep 02 09:31:29 rmg-vpn-01 sshd[24236]: Invalid user oracle from 203.0.113.88 port 46068
Sep 02 09:31:30 rmg-vpn-01 sshd[24236]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:31:30 rmg-vpn-01 sshd[24236]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.88
Sep 02 09:31:32 rmg-vpn-01 sshd[24236]: Failed password for invalid user oracle from 203.0.113.88 port 46068 ssh2
Sep 02 09:31:33 rmg-vpn-01 sshd[24236]: Connection closed by invalid user oracle 203.0.113.88 port 46068 [preauth]
Sep 02 09:31:34 rmg-vpn-01 sshd[24239]: Invalid user admin from 198.51.100.77 port 51471
Sep 02 09:31:35 rmg-vpn-01 sshd[24239]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:31:35 rmg-vpn-01 sshd[24239]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.77
Sep 02 09:31:37 rmg-vpn-01 sshd[24239]: Failed password for invalid user admin from 198.51.100.77 port 51471 ssh2
Sep 02 09:31:38 rmg-vpn-01 sshd[24239]: Connection closed by invalid user admin 198.51.100.77 port 51471 [preauth]
Sep 02 09:31:44 rmg-vpn-01 sshd[24243]: Invalid user test from 203.0.113.90 port 50008
Sep 02 09:31:45 rmg-vpn-01 sshd[24243]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:31:45 rmg-vpn-01 sshd[24243]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:31:47 rmg-vpn-01 sshd[24243]: Failed password for invalid user test from 203.0.113.90 port 50008 ssh2
Sep 02 09:31:47 rmg-vpn-01 sshd[24251]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90  user=postgres
Sep 02 09:31:48 rmg-vpn-01 sshd[24243]: Connection closed by invalid user test 203.0.113.90 port 50008 [preauth]
Sep 02 09:31:49 rmg-vpn-01 sshd[24251]: Failed password for postgres from 203.0.113.90 port 46763 ssh2
Sep 02 09:31:52 rmg-vpn-01 sshd[24255]: Invalid user git from 198.51.100.77 port 42917
Sep 02 09:31:53 rmg-vpn-01 sshd[24255]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:31:53 rmg-vpn-01 sshd[24255]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.77
Sep 02 09:31:55 rmg-vpn-01 sshd[24255]: Failed password for invalid user git from 198.51.100.77 port 42917 ssh2
Sep 02 09:31:56 rmg-vpn-01 sshd[24255]: Connection closed by invalid user git 198.51.100.77 port 42917 [preauth]
Sep 02 09:32:00 rmg-vpn-01 sshd[24259]: Invalid user deploy from 203.0.113.90 port 30245
Sep 02 09:32:01 rmg-vpn-01 sshd[24259]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:32:01 rmg-vpn-01 sshd[24259]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:32:03 rmg-vpn-01 sshd[24259]: Failed password for invalid user deploy from 203.0.113.90 port 30245 ssh2
Sep 02 09:32:04 rmg-vpn-01 sshd[24259]: Connection closed by invalid user deploy 203.0.113.90 port 30245 [preauth]
Sep 02 09:32:09 rmg-vpn-01 sshd[24260]: Invalid user test from 203.0.113.90 port 35822
Sep 02 09:32:10 rmg-vpn-01 sshd[24260]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:32:10 rmg-vpn-01 sshd[24260]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:32:12 rmg-vpn-01 sshd[24260]: Failed password for invalid user test from 203.0.113.90 port 35822 ssh2
Sep 02 09:32:13 rmg-vpn-01 sshd[24260]: Connection closed by invalid user test 203.0.113.90 port 35822 [preauth]
Sep 02 09:32:13 rmg-vpn-01 sshd[24268]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90  user=postgres
Sep 02 09:32:15 rmg-vpn-01 sshd[24268]: Failed password for postgres from 203.0.113.90 port 60458 ssh2
Sep 02 09:32:19 rmg-vpn-01 sshd[24276]: Invalid user ubuntu from 203.0.113.90 port 43170
Sep 02 09:32:20 rmg-vpn-01 sshd[24276]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:32:20 rmg-vpn-01 sshd[24276]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:32:22 rmg-vpn-01 sshd[24276]: Failed password for invalid user ubuntu from 203.0.113.90 port 43170 ssh2
Sep 02 09:32:23 rmg-vpn-01 sshd[24276]: Connection closed by invalid user ubuntu 203.0.113.90 port 43170 [preauth]
Sep 02 09:32:27 rmg-vpn-01 sshd[24284]: Invalid user git from 198.51.100.77 port 54935
Sep 02 09:32:28 rmg-vpn-01 sshd[24284]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:32:28 rmg-vpn-01 sshd[24284]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.77
Sep 02 09:32:30 rmg-vpn-01 sshd[24284]: Failed password for invalid user git from 198.51.100.77 port 54935 ssh2
Sep 02 09:32:31 rmg-vpn-01 sshd[24284]: Connection closed by invalid user git 198.51.100.77 port 54935 [preauth]
Sep 02 09:32:33 rmg-vpn-01 sshd[24290]: Invalid user admin from 203.0.113.90 port 63875
Sep 02 09:32:34 rmg-vpn-01 sshd[24290]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:32:34 rmg-vpn-01 sshd[24290]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:32:36 rmg-vpn-01 sshd[24290]: Failed password for invalid user admin from 203.0.113.90 port 63875 ssh2
Sep 02 09:32:37 rmg-vpn-01 sshd[24290]: Connection closed by invalid user admin 203.0.113.90 port 63875 [preauth]
Sep 02 09:32:44 rmg-vpn-01 sshd[24295]: Invalid user deploy from 203.0.113.90 port 64857
Sep 02 09:32:45 rmg-vpn-01 sshd[24295]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:32:45 rmg-vpn-01 sshd[24295]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:32:47 rmg-vpn-01 sshd[24295]: Failed password for invalid user deploy from 203.0.113.90 port 64857 ssh2
Sep 02 09:32:48 rmg-vpn-01 sshd[24295]: Connection closed by invalid user deploy 203.0.113.90 port 64857 [preauth]
Sep 02 09:32:50 rmg-vpn-01 sshd[24296]: Invalid user deploy from 198.51.100.77 port 58461
Sep 02 09:32:51 rmg-vpn-01 sshd[24296]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:32:51 rmg-vpn-01 sshd[24296]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.77
Sep 02 09:32:53 rmg-vpn-01 sshd[24296]: Failed password for invalid user deploy from 198.51.100.77 port 58461 ssh2
Sep 02 09:32:53 rmg-vpn-01 sshd[24301]: Invalid user oracle from 203.0.113.90 port 36923
Sep 02 09:32:54 rmg-vpn-01 sshd[24296]: Connection closed by invalid user deploy 198.51.100.77 port 58461 [preauth]
Sep 02 09:32:54 rmg-vpn-01 sshd[24301]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:32:54 rmg-vpn-01 sshd[24301]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:32:56 rmg-vpn-01 sshd[24301]: Failed password for invalid user oracle from 203.0.113.90 port 36923 ssh2
Sep 02 09:32:57 rmg-vpn-01 sshd[24301]: Connection closed by invalid user oracle 203.0.113.90 port 36923 [preauth]
Sep 02 09:33:03 rmg-vpn-01 sshd[24303]: Invalid user ubuntu from 198.51.100.77 port 46190
Sep 02 09:33:04 rmg-vpn-01 sshd[24303]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:33:04 rmg-vpn-01 sshd[24303]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.77
Sep 02 09:33:06 rmg-vpn-01 sshd[24303]: Failed password for invalid user ubuntu from 198.51.100.77 port 46190 ssh2
Sep 02 09:33:07 rmg-vpn-01 sshd[24303]: Connection closed by invalid user ubuntu 198.51.100.77 port 46190 [preauth]
Sep 02 09:33:08 rmg-vpn-01 sshd[24311]: Invalid user deploy from 203.0.113.90 port 64552
Sep 02 09:33:09 rmg-vpn-01 sshd[24311]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:33:09 rmg-vpn-01 sshd[24311]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:33:11 rmg-vpn-01 sshd[24311]: Failed password for invalid user deploy from 203.0.113.90 port 64552 ssh2
Sep 02 09:33:12 rmg-vpn-01 sshd[24311]: Connection closed by invalid user deploy 203.0.113.90 port 64552 [preauth]
Sep 02 09:33:17 rmg-vpn-01 sshd[24316]: Invalid user admin from 203.0.113.90 port 42721
Sep 02 09:33:18 rmg-vpn-01 sshd[24316]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:33:18 rmg-vpn-01 sshd[24316]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:33:20 rmg-vpn-01 sshd[24316]: Failed password for invalid user admin from 203.0.113.90 port 42721 ssh2
Sep 02 09:33:21 rmg-vpn-01 sshd[24316]: Connection closed by invalid user admin 203.0.113.90 port 42721 [preauth]
Sep 02 09:33:21 rmg-vpn-01 sshd[24317]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90  user=jdelacruz
Sep 02 09:33:23 rmg-vpn-01 sshd[24317]: Failed password for jdelacruz from 203.0.113.90 port 39186 ssh2
Sep 02 09:33:24 rmg-vpn-01 sshd[24325]: Invalid user deploy from 203.0.113.12 port 56144
Sep 02 09:33:25 rmg-vpn-01 sshd[24325]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:33:25 rmg-vpn-01 sshd[24325]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12
Sep 02 09:33:27 rmg-vpn-01 sshd[24325]: Failed password for invalid user deploy from 203.0.113.12 port 56144 ssh2
Sep 02 09:33:28 rmg-vpn-01 sshd[24325]: Connection closed by invalid user deploy 203.0.113.12 port 56144 [preauth]
Sep 02 09:33:32 rmg-vpn-01 sshd[24333]: Invalid user admin from 203.0.113.90 port 36264
Sep 02 09:33:33 rmg-vpn-01 sshd[24333]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:33:33 rmg-vpn-01 sshd[24333]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:33:35 rmg-vpn-01 sshd[24333]: Failed password for invalid user admin from 203.0.113.90 port 36264 ssh2
Sep 02 09:33:36 rmg-vpn-01 sshd[24333]: Connection closed by invalid user admin 203.0.113.90 port 36264 [preauth]
Sep 02 09:33:40 rmg-vpn-01 sshd[24334]: Invalid user oracle from 203.0.113.90 port 34675
Sep 02 09:33:41 rmg-vpn-01 sshd[24334]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:33:41 rmg-vpn-01 sshd[24334]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:33:43 rmg-vpn-01 sshd[24334]: Failed password for invalid user oracle from 203.0.113.90 port 34675 ssh2
Sep 02 09:33:44 rmg-vpn-01 sshd[24334]: Connection closed by invalid user oracle 203.0.113.90 port 34675 [preauth]
Sep 02 09:33:49 rmg-vpn-01 sshd[24339]: Invalid user admin from 203.0.113.90 port 38225
Sep 02 09:33:50 rmg-vpn-01 sshd[24339]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:33:50 rmg-vpn-01 sshd[24339]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:33:52 rmg-vpn-01 sshd[24339]: Failed password for invalid user admin from 203.0.113.90 port 38225 ssh2
Sep 02 09:33:53 rmg-vpn-01 sshd[24339]: Connection closed by invalid user admin 203.0.113.90 port 38225 [preauth]
Sep 02 09:33:53 rmg-vpn-01 sshd[24340]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90  user=postgres
Sep 02 09:33:55 rmg-vpn-01 sshd[24340]: Failed password for postgres from 203.0.113.90 port 49377 ssh2
Sep 02 09:34:04 rmg-vpn-01 sshd[24342]: Invalid user ubuntu from 203.0.113.90 port 36533
Sep 02 09:34:05 rmg-vpn-01 sshd[24342]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:34:05 rmg-vpn-01 sshd[24342]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:34:07 rmg-vpn-01 sshd[24342]: Failed password for invalid user ubuntu from 203.0.113.90 port 36533 ssh2
Sep 02 09:34:08 rmg-vpn-01 sshd[24342]: Connection closed by invalid user ubuntu 203.0.113.90 port 36533 [preauth]
Sep 02 09:34:13 rmg-vpn-01 sshd[24345]: Invalid user ubuntu from 198.51.100.77 port 54177
Sep 02 09:34:14 rmg-vpn-01 sshd[24345]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:34:14 rmg-vpn-01 sshd[24345]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.77
Sep 02 09:34:16 rmg-vpn-01 sshd[24345]: Failed password for invalid user ubuntu from 198.51.100.77 port 54177 ssh2
Sep 02 09:34:17 rmg-vpn-01 sshd[24345]: Connection closed by invalid user ubuntu 198.51.100.77 port 54177 [preauth]
Sep 02 09:34:24 rmg-vpn-01 sshd[24354]: Invalid user deploy from 203.0.113.90 port 41969
Sep 02 09:34:25 rmg-vpn-01 sshd[24354]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:34:25 rmg-vpn-01 sshd[24354]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:34:27 rmg-vpn-01 sshd[24354]: Failed password for invalid user deploy from 203.0.113.90 port 41969 ssh2
Sep 02 09:34:28 rmg-vpn-01 sshd[24354]: Connection closed by invalid user deploy 203.0.113.90 port 41969 [preauth]
Sep 02 09:34:35 rmg-vpn-01 sshd[24363]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90  user=jdelacruz
Sep 02 09:34:37 rmg-vpn-01 sshd[24363]: Failed password for jdelacruz from 203.0.113.90 port 61254 ssh2
Sep 02 09:34:44 rmg-vpn-01 sshd[24365]: Invalid user ubuntu from 203.0.113.88 port 59500
Sep 02 09:34:45 rmg-vpn-01 sshd[24365]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:34:45 rmg-vpn-01 sshd[24365]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.88
Sep 02 09:34:47 rmg-vpn-01 sshd[24365]: Failed password for invalid user ubuntu from 203.0.113.88 port 59500 ssh2
Sep 02 09:34:48 rmg-vpn-01 sshd[24365]: Connection closed by invalid user ubuntu 203.0.113.88 port 59500 [preauth]
Sep 02 09:34:51 rmg-vpn-01 sshd[24371]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.77  user=jdelacruz
Sep 02 09:34:53 rmg-vpn-01 sshd[24371]: Failed password for jdelacruz from 198.51.100.77 port 51687 ssh2
Sep 02 09:34:58 rmg-vpn-01 sshd[24377]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90  user=jdelacruz
Sep 02 09:35:00 rmg-vpn-01 sshd[24377]: Failed password for jdelacruz from 203.0.113.90 port 62404 ssh2
Sep 02 09:35:05 rmg-vpn-01 sshd[24381]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90  user=postgres
Sep 02 09:35:07 rmg-vpn-01 sshd[24381]: Failed password for postgres from 203.0.113.90 port 59447 ssh2
Sep 02 09:35:10 rmg-vpn-01 sshd[24386]: Invalid user test from 203.0.113.90 port 41570
Sep 02 09:35:11 rmg-vpn-01 sshd[24386]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:35:11 rmg-vpn-01 sshd[24386]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:35:13 rmg-vpn-01 sshd[24386]: Failed password for invalid user test from 203.0.113.90 port 41570 ssh2
Sep 02 09:35:14 rmg-vpn-01 sshd[24386]: Connection closed by invalid user test 203.0.113.90 port 41570 [preauth]
Sep 02 09:35:16 rmg-vpn-01 sshd[22004]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 09:35:17 rmg-vpn-01 sshd[24395]: Invalid user test from 203.0.113.90 port 44094
Sep 02 09:35:18 rmg-vpn-01 sshd[22004]: Failed password for nagios from 10.20.9.40 port 34677 ssh2
Sep 02 09:35:18 rmg-vpn-01 sshd[24395]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:35:18 rmg-vpn-01 sshd[24395]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:35:20 rmg-vpn-01 sshd[24395]: Failed password for invalid user test from 203.0.113.90 port 44094 ssh2
Sep 02 09:35:21 rmg-vpn-01 sshd[24395]: Connection closed by invalid user test 203.0.113.90 port 44094 [preauth]
Sep 02 09:35:24 rmg-vpn-01 sshd[24402]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90  user=jdelacruz
Sep 02 09:35:26 rmg-vpn-01 sshd[24402]: Failed password for jdelacruz from 203.0.113.90 port 60490 ssh2
Sep 02 09:35:31 rmg-vpn-01 sshd[24409]: Invalid user test from 203.0.113.90 port 55180
Sep 02 09:35:32 rmg-vpn-01 sshd[24409]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:35:32 rmg-vpn-01 sshd[24409]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:35:34 rmg-vpn-01 sshd[24409]: Failed password for invalid user test from 203.0.113.90 port 55180 ssh2
Sep 02 09:35:35 rmg-vpn-01 sshd[24409]: Connection closed by invalid user test 203.0.113.90 port 55180 [preauth]
Sep 02 09:35:36 rmg-vpn-01 sshd[24415]: Invalid user git from 203.0.113.90 port 36158
Sep 02 09:35:37 rmg-vpn-01 sshd[24415]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:35:37 rmg-vpn-01 sshd[24415]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:35:39 rmg-vpn-01 sshd[24415]: Failed password for invalid user git from 203.0.113.90 port 36158 ssh2
Sep 02 09:35:40 rmg-vpn-01 sshd[24415]: Connection closed by invalid user git 203.0.113.90 port 36158 [preauth]
Sep 02 09:35:40 rmg-vpn-01 sshd[24422]: Invalid user admin from 203.0.113.90 port 43631
Sep 02 09:35:41 rmg-vpn-01 sshd[24422]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:35:41 rmg-vpn-01 sshd[24422]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:35:43 rmg-vpn-01 sshd[24422]: Failed password for invalid user admin from 203.0.113.90 port 43631 ssh2
Sep 02 09:35:44 rmg-vpn-01 sshd[24422]: Connection closed by invalid user admin 203.0.113.90 port 43631 [preauth]
Sep 02 09:35:46 rmg-vpn-01 sshd[24430]: Invalid user ubuntu from 203.0.113.90 port 46666
Sep 02 09:35:47 rmg-vpn-01 sshd[24430]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:35:47 rmg-vpn-01 sshd[24430]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:35:49 rmg-vpn-01 sshd[24430]: Failed password for invalid user ubuntu from 203.0.113.90 port 46666 ssh2
Sep 02 09:35:50 rmg-vpn-01 sshd[24430]: Connection closed by invalid user ubuntu 203.0.113.90 port 46666 [preauth]
Sep 02 09:35:50 rmg-vpn-01 sshd[24431]: Invalid user git from 203.0.113.90 port 33972
Sep 02 09:35:51 rmg-vpn-01 sshd[24431]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:35:51 rmg-vpn-01 sshd[24431]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:35:53 rmg-vpn-01 sshd[24431]: Failed password for invalid user git from 203.0.113.90 port 33972 ssh2
Sep 02 09:35:54 rmg-vpn-01 sshd[24431]: Connection closed by invalid user git 203.0.113.90 port 33972 [preauth]
Sep 02 09:35:56 rmg-vpn-01 sshd[24437]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.77  user=jdelacruz
Sep 02 09:35:58 rmg-vpn-01 sshd[24437]: Failed password for jdelacruz from 198.51.100.77 port 64364 ssh2
Sep 02 09:36:03 rmg-vpn-01 sshd[24440]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90  user=root
Sep 02 09:36:05 rmg-vpn-01 sshd[24440]: Failed password for root from 203.0.113.90 port 62001 ssh2
Sep 02 09:36:09 rmg-vpn-01 sshd[24447]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.88  user=root
Sep 02 09:36:11 rmg-vpn-01 sshd[24447]: Failed password for root from 203.0.113.88 port 64487 ssh2
Sep 02 09:36:16 rmg-vpn-01 sshd[24452]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.88  user=jdelacruz
Sep 02 09:36:18 rmg-vpn-01 sshd[24452]: Failed password for jdelacruz from 203.0.113.88 port 49034 ssh2
Sep 02 09:36:24 rmg-vpn-01 sshd[24456]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90  user=postgres
Sep 02 09:36:26 rmg-vpn-01 sshd[24456]: Failed password for postgres from 203.0.113.90 port 53864 ssh2
Sep 02 09:36:32 rmg-vpn-01 sshd[24464]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90  user=jdelacruz
Sep 02 09:36:34 rmg-vpn-01 sshd[24464]: Failed password for jdelacruz from 203.0.113.90 port 32830 ssh2
Sep 02 09:36:40 rmg-vpn-01 sshd[24473]: Invalid user test from 203.0.113.88 port 47947
Sep 02 09:36:41 rmg-vpn-01 sshd[24473]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:36:41 rmg-vpn-01 sshd[24473]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.88
Sep 02 09:36:43 rmg-vpn-01 sshd[24473]: Failed password for invalid user test from 203.0.113.88 port 47947 ssh2
Sep 02 09:36:44 rmg-vpn-01 sshd[24473]: Connection closed by invalid user test 203.0.113.88 port 47947 [preauth]
Sep 02 09:36:45 rmg-vpn-01 sshd[24478]: Invalid user test from 203.0.113.88 port 30055
Sep 02 09:36:46 rmg-vpn-01 sshd[24478]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:36:46 rmg-vpn-01 sshd[24478]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.88
Sep 02 09:36:48 rmg-vpn-01 sshd[24478]: Failed password for invalid user test from 203.0.113.88 port 30055 ssh2
Sep 02 09:36:49 rmg-vpn-01 sshd[24478]: Connection closed by invalid user test 203.0.113.88 port 30055 [preauth]
Sep 02 09:36:53 rmg-vpn-01 sshd[24485]: Invalid user deploy from 203.0.113.90 port 46853
Sep 02 09:36:54 rmg-vpn-01 sshd[24485]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:36:54 rmg-vpn-01 sshd[24485]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:36:56 rmg-vpn-01 sshd[24485]: Failed password for invalid user deploy from 203.0.113.90 port 46853 ssh2
Sep 02 09:36:57 rmg-vpn-01 sshd[24485]: Connection closed by invalid user deploy 203.0.113.90 port 46853 [preauth]
Sep 02 09:37:03 rmg-vpn-01 sshd[24490]: Invalid user git from 203.0.113.90 port 43827
Sep 02 09:37:04 rmg-vpn-01 sshd[24490]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:37:04 rmg-vpn-01 sshd[24490]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:37:06 rmg-vpn-01 sshd[24490]: Failed password for invalid user git from 203.0.113.90 port 43827 ssh2
Sep 02 09:37:06 rmg-vpn-01 sshd[24492]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90  user=jdelacruz
Sep 02 09:37:07 rmg-vpn-01 sshd[24490]: Connection closed by invalid user git 203.0.113.90 port 43827 [preauth]
Sep 02 09:37:08 rmg-vpn-01 sshd[24492]: Failed password for jdelacruz from 203.0.113.90 port 35345 ssh2
Sep 02 09:37:10 rmg-vpn-01 sshd[24494]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90  user=postgres
Sep 02 09:37:12 rmg-vpn-01 sshd[24494]: Failed password for postgres from 203.0.113.90 port 62825 ssh2
Sep 02 09:37:15 rmg-vpn-01 sshd[24499]: Invalid user test from 203.0.113.90 port 36250
Sep 02 09:37:16 rmg-vpn-01 sshd[24499]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:37:16 rmg-vpn-01 sshd[24499]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:37:18 rmg-vpn-01 sshd[24499]: Failed password for invalid user test from 203.0.113.90 port 36250 ssh2
Sep 02 09:37:19 rmg-vpn-01 sshd[24499]: Connection closed by invalid user test 203.0.113.90 port 36250 [preauth]
Sep 02 09:37:20 rmg-vpn-01 sshd[24506]: Invalid user git from 198.51.100.77 port 37932
Sep 02 09:37:21 rmg-vpn-01 sshd[24506]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:37:21 rmg-vpn-01 sshd[24506]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.77
Sep 02 09:37:23 rmg-vpn-01 sshd[24506]: Failed password for invalid user git from 198.51.100.77 port 37932 ssh2
Sep 02 09:37:24 rmg-vpn-01 sshd[24506]: Connection closed by invalid user git 198.51.100.77 port 37932 [preauth]
Sep 02 09:37:26 rmg-vpn-01 sshd[24513]: Invalid user ubuntu from 203.0.113.90 port 48787
Sep 02 09:37:27 rmg-vpn-01 sshd[24513]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:37:27 rmg-vpn-01 sshd[24513]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:37:29 rmg-vpn-01 sshd[24513]: Failed password for invalid user ubuntu from 203.0.113.90 port 48787 ssh2
Sep 02 09:37:30 rmg-vpn-01 sshd[24513]: Connection closed by invalid user ubuntu 203.0.113.90 port 48787 [preauth]
Sep 02 09:37:30 rmg-vpn-01 sshd[24518]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90  user=jdelacruz
Sep 02 09:37:32 rmg-vpn-01 sshd[24518]: Failed password for jdelacruz from 203.0.113.90 port 61423 ssh2
Sep 02 09:37:35 rmg-vpn-01 sshd[24526]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90  user=jdelacruz
Sep 02 09:37:37 rmg-vpn-01 sshd[24526]: Failed password for jdelacruz from 203.0.113.90 port 55096 ssh2
Sep 02 09:37:42 rmg-vpn-01 sshd[24531]: Invalid user ubuntu from 203.0.113.90 port 49183
Sep 02 09:37:43 rmg-vpn-01 sshd[24531]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:37:43 rmg-vpn-01 sshd[24531]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:37:45 rmg-vpn-01 sshd[24531]: Failed password for invalid user ubuntu from 203.0.113.90 port 49183 ssh2
Sep 02 09:37:46 rmg-vpn-01 sshd[24531]: Connection closed by invalid user ubuntu 203.0.113.90 port 49183 [preauth]
Sep 02 09:37:51 rmg-vpn-01 sshd[24540]: Invalid user test from 198.51.100.77 port 50282
Sep 02 09:37:52 rmg-vpn-01 sshd[24540]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:37:52 rmg-vpn-01 sshd[24540]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.77
Sep 02 09:37:54 rmg-vpn-01 sshd[24540]: Failed password for invalid user test from 198.51.100.77 port 50282 ssh2
Sep 02 09:37:55 rmg-vpn-01 sshd[24540]: Connection closed by invalid user test 198.51.100.77 port 50282 [preauth]
Sep 02 09:37:57 rmg-vpn-01 sshd[24541]: Invalid user admin from 203.0.113.90 port 53396
Sep 02 09:37:58 rmg-vpn-01 sshd[24541]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:37:58 rmg-vpn-01 sshd[24541]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:38:00 rmg-vpn-01 sshd[24541]: Failed password for invalid user admin from 203.0.113.90 port 53396 ssh2
Sep 02 09:38:01 rmg-vpn-01 sshd[24541]: Connection closed by invalid user admin 203.0.113.90 port 53396 [preauth]
Sep 02 09:38:04 rmg-vpn-01 sshd[24543]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12  user=postgres
Sep 02 09:38:06 rmg-vpn-01 sshd[24543]: Failed password for postgres from 203.0.113.12 port 44063 ssh2
Sep 02 09:38:13 rmg-vpn-01 sshd[24552]: Invalid user deploy from 203.0.113.90 port 39881
Sep 02 09:38:14 rmg-vpn-01 sshd[24552]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:38:14 rmg-vpn-01 sshd[24552]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:38:16 rmg-vpn-01 sshd[24552]: Failed password for invalid user deploy from 203.0.113.90 port 39881 ssh2
Sep 02 09:38:17 rmg-vpn-01 sshd[24552]: Connection closed by invalid user deploy 203.0.113.90 port 39881 [preauth]
Sep 02 09:38:24 rmg-vpn-01 sshd[24555]: Invalid user test from 198.51.100.77 port 32477
Sep 02 09:38:25 rmg-vpn-01 sshd[24555]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:38:25 rmg-vpn-01 sshd[24555]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.77
Sep 02 09:38:27 rmg-vpn-01 sshd[24555]: Failed password for invalid user test from 198.51.100.77 port 32477 ssh2
Sep 02 09:38:28 rmg-vpn-01 sshd[24555]: Connection closed by invalid user test 198.51.100.77 port 32477 [preauth]
Sep 02 09:38:28 rmg-vpn-01 sshd[24556]: Invalid user deploy from 203.0.113.90 port 38586
Sep 02 09:38:29 rmg-vpn-01 sshd[24556]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:38:29 rmg-vpn-01 sshd[24556]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:38:31 rmg-vpn-01 sshd[24556]: Failed password for invalid user deploy from 203.0.113.90 port 38586 ssh2
Sep 02 09:38:32 rmg-vpn-01 sshd[24556]: Connection closed by invalid user deploy 203.0.113.90 port 38586 [preauth]
Sep 02 09:38:39 rmg-vpn-01 sshd[24560]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.88  user=jdelacruz
Sep 02 09:38:41 rmg-vpn-01 sshd[24560]: Failed password for jdelacruz from 203.0.113.88 port 39214 ssh2
Sep 02 09:38:50 rmg-vpn-01 sshd[24568]: Invalid user test from 203.0.113.88 port 54554
Sep 02 09:38:51 rmg-vpn-01 sshd[24568]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:38:51 rmg-vpn-01 sshd[24568]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.88
Sep 02 09:38:53 rmg-vpn-01 sshd[24568]: Failed password for invalid user test from 203.0.113.88 port 54554 ssh2
Sep 02 09:38:54 rmg-vpn-01 sshd[24568]: Connection closed by invalid user test 203.0.113.88 port 54554 [preauth]
Sep 02 09:38:57 rmg-vpn-01 sshd[24572]: Invalid user git from 203.0.113.90 port 39261
Sep 02 09:38:58 rmg-vpn-01 sshd[24572]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:38:58 rmg-vpn-01 sshd[24572]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:39:00 rmg-vpn-01 sshd[24572]: Failed password for invalid user git from 203.0.113.90 port 39261 ssh2
Sep 02 09:39:01 rmg-vpn-01 sshd[24572]: Connection closed by invalid user git 203.0.113.90 port 39261 [preauth]
Sep 02 09:39:05 rmg-vpn-01 sshd[24581]: Invalid user ubuntu from 203.0.113.90 port 56015
Sep 02 09:39:06 rmg-vpn-01 sshd[24581]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:39:06 rmg-vpn-01 sshd[24581]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:39:08 rmg-vpn-01 sshd[24581]: Failed password for invalid user ubuntu from 203.0.113.90 port 56015 ssh2
Sep 02 09:39:09 rmg-vpn-01 sshd[24581]: Connection closed by invalid user ubuntu 203.0.113.90 port 56015 [preauth]
Sep 02 09:39:09 rmg-vpn-01 sshd[24588]: Invalid user ubuntu from 203.0.113.90 port 55373
Sep 02 09:39:10 rmg-vpn-01 sshd[24588]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:39:10 rmg-vpn-01 sshd[24588]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:39:12 rmg-vpn-01 sshd[24588]: Failed password for invalid user ubuntu from 203.0.113.90 port 55373 ssh2
Sep 02 09:39:13 rmg-vpn-01 sshd[24588]: Connection closed by invalid user ubuntu 203.0.113.90 port 55373 [preauth]
Sep 02 09:39:14 rmg-vpn-01 sshd[24590]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90  user=root
Sep 02 09:39:16 rmg-vpn-01 sshd[24590]: Failed password for root from 203.0.113.90 port 48157 ssh2
Sep 02 09:39:23 rmg-vpn-01 sshd[24593]: Invalid user deploy from 198.51.100.77 port 49751
Sep 02 09:39:24 rmg-vpn-01 sshd[24593]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:39:24 rmg-vpn-01 sshd[24593]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.77
Sep 02 09:39:26 rmg-vpn-01 sshd[24593]: Failed password for invalid user deploy from 198.51.100.77 port 49751 ssh2
Sep 02 09:39:27 rmg-vpn-01 sshd[24593]: Connection closed by invalid user deploy 198.51.100.77 port 49751 [preauth]
Sep 02 09:39:32 rmg-vpn-01 sshd[24601]: Invalid user test from 203.0.113.90 port 30035
Sep 02 09:39:33 rmg-vpn-01 sshd[24601]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:39:33 rmg-vpn-01 sshd[24601]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:39:35 rmg-vpn-01 sshd[24601]: Failed password for invalid user test from 203.0.113.90 port 30035 ssh2
Sep 02 09:39:36 rmg-vpn-01 sshd[24601]: Connection closed by invalid user test 203.0.113.90 port 30035 [preauth]
Sep 02 09:39:42 rmg-vpn-01 sshd[24602]: Invalid user ubuntu from 203.0.113.90 port 32327
Sep 02 09:39:43 rmg-vpn-01 sshd[24602]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:39:43 rmg-vpn-01 sshd[24602]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:39:45 rmg-vpn-01 sshd[24602]: Failed password for invalid user ubuntu from 203.0.113.90 port 32327 ssh2
Sep 02 09:39:46 rmg-vpn-01 sshd[24602]: Connection closed by invalid user ubuntu 203.0.113.90 port 32327 [preauth]
Sep 02 09:39:51 rmg-vpn-01 sshd[24611]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.88  user=root
Sep 02 09:39:53 rmg-vpn-01 sshd[24611]: Failed password for root from 203.0.113.88 port 35879 ssh2
Sep 02 09:40:02 rmg-vpn-01 sshd[24618]: Invalid user admin from 198.51.100.77 port 36139
Sep 02 09:40:03 rmg-vpn-01 sshd[24618]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:40:03 rmg-vpn-01 sshd[24618]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.77
Sep 02 09:40:05 rmg-vpn-01 sshd[24618]: Failed password for invalid user admin from 198.51.100.77 port 36139 ssh2
Sep 02 09:40:06 rmg-vpn-01 sshd[24618]: Connection closed by invalid user admin 198.51.100.77 port 36139 [preauth]
Sep 02 09:40:10 rmg-vpn-01 sshd[24624]: Invalid user ubuntu from 198.51.100.77 port 35563
Sep 02 09:40:11 rmg-vpn-01 sshd[24624]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:40:11 rmg-vpn-01 sshd[24624]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.77
Sep 02 09:40:13 rmg-vpn-01 sshd[24624]: Failed password for invalid user ubuntu from 198.51.100.77 port 35563 ssh2
Sep 02 09:40:14 rmg-vpn-01 sshd[24624]: Connection closed by invalid user ubuntu 198.51.100.77 port 35563 [preauth]
Sep 02 09:40:17 rmg-vpn-01 sshd[24628]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.77  user=jdelacruz
Sep 02 09:40:19 rmg-vpn-01 sshd[24628]: Failed password for jdelacruz from 198.51.100.77 port 41416 ssh2
Sep 02 09:40:26 rmg-vpn-01 sshd[22012]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 09:40:27 rmg-vpn-01 sshd[24629]: Invalid user admin from 203.0.113.90 port 46700
Sep 02 09:40:28 rmg-vpn-01 sshd[22012]: Failed password for nagios from 10.20.9.40 port 42937 ssh2
Sep 02 09:40:28 rmg-vpn-01 sshd[24629]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:40:28 rmg-vpn-01 sshd[24629]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:40:30 rmg-vpn-01 sshd[24629]: Failed password for invalid user admin from 203.0.113.90 port 46700 ssh2
Sep 02 09:40:31 rmg-vpn-01 sshd[24629]: Connection closed by invalid user admin 203.0.113.90 port 46700 [preauth]
Sep 02 09:40:37 rmg-vpn-01 sshd[24632]: Invalid user admin from 203.0.113.90 port 53399
Sep 02 09:40:38 rmg-vpn-01 sshd[24632]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:40:38 rmg-vpn-01 sshd[24632]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:40:40 rmg-vpn-01 sshd[24632]: Failed password for invalid user admin from 203.0.113.90 port 53399 ssh2
Sep 02 09:40:41 rmg-vpn-01 sshd[24632]: Connection closed by invalid user admin 203.0.113.90 port 53399 [preauth]
Sep 02 09:40:42 rmg-vpn-01 sshd[24635]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90  user=postgres
Sep 02 09:40:44 rmg-vpn-01 sshd[24635]: Failed password for postgres from 203.0.113.90 port 59911 ssh2
Sep 02 09:40:50 rmg-vpn-01 sshd[24636]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90  user=postgres
Sep 02 09:40:52 rmg-vpn-01 sshd[24636]: Failed password for postgres from 203.0.113.90 port 30735 ssh2
Sep 02 09:40:54 rmg-vpn-01 sshd[24644]: Invalid user admin from 203.0.113.12 port 60726
Sep 02 09:40:55 rmg-vpn-01 sshd[24644]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:40:55 rmg-vpn-01 sshd[24644]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12
Sep 02 09:40:57 rmg-vpn-01 sshd[24644]: Failed password for invalid user admin from 203.0.113.12 port 60726 ssh2
Sep 02 09:40:58 rmg-vpn-01 sshd[24644]: Connection closed by invalid user admin 203.0.113.12 port 60726 [preauth]
Sep 02 09:40:58 rmg-vpn-01 sshd[24651]: Invalid user git from 203.0.113.12 port 48391
Sep 02 09:40:59 rmg-vpn-01 sshd[24651]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:40:59 rmg-vpn-01 sshd[24651]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12
Sep 02 09:41:01 rmg-vpn-01 sshd[24651]: Failed password for invalid user git from 203.0.113.12 port 48391 ssh2
Sep 02 09:41:02 rmg-vpn-01 sshd[24651]: Connection closed by invalid user git 203.0.113.12 port 48391 [preauth]
Sep 02 09:41:04 rmg-vpn-01 sshd[24654]: Invalid user deploy from 203.0.113.90 port 61175
Sep 02 09:41:05 rmg-vpn-01 sshd[24654]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:41:05 rmg-vpn-01 sshd[24654]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:41:07 rmg-vpn-01 sshd[24654]: Failed password for invalid user deploy from 203.0.113.90 port 61175 ssh2
Sep 02 09:41:08 rmg-vpn-01 sshd[24654]: Connection closed by invalid user deploy 203.0.113.90 port 61175 [preauth]
Sep 02 09:41:11 rmg-vpn-01 sshd[24658]: Invalid user ubuntu from 198.51.100.77 port 41497
Sep 02 09:41:12 rmg-vpn-01 sshd[24658]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:41:12 rmg-vpn-01 sshd[24658]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.77
Sep 02 09:41:14 rmg-vpn-01 sshd[24658]: Failed password for invalid user ubuntu from 198.51.100.77 port 41497 ssh2
Sep 02 09:41:15 rmg-vpn-01 sshd[24658]: Connection closed by invalid user ubuntu 198.51.100.77 port 41497 [preauth]
Sep 02 09:41:22 rmg-vpn-01 sshd[24660]: Invalid user git from 198.51.100.77 port 46106
Sep 02 09:41:23 rmg-vpn-01 sshd[24660]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:41:23 rmg-vpn-01 sshd[24660]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.77
Sep 02 09:41:25 rmg-vpn-01 sshd[24660]: Failed password for invalid user git from 198.51.100.77 port 46106 ssh2
Sep 02 09:41:26 rmg-vpn-01 sshd[24660]: Connection closed by invalid user git 198.51.100.77 port 46106 [preauth]
Sep 02 09:41:29 rmg-vpn-01 sshd[24663]: Invalid user ubuntu from 203.0.113.90 port 31729
Sep 02 09:41:30 rmg-vpn-01 sshd[24663]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:41:30 rmg-vpn-01 sshd[24663]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:41:32 rmg-vpn-01 sshd[24663]: Failed password for invalid user ubuntu from 203.0.113.90 port 31729 ssh2
Sep 02 09:41:33 rmg-vpn-01 sshd[24663]: Connection closed by invalid user ubuntu 203.0.113.90 port 31729 [preauth]
Sep 02 09:41:34 rmg-vpn-01 sshd[24667]: Invalid user deploy from 203.0.113.90 port 31634
Sep 02 09:41:35 rmg-vpn-01 sshd[24667]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:41:35 rmg-vpn-01 sshd[24667]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:41:37 rmg-vpn-01 sshd[24667]: Failed password for invalid user deploy from 203.0.113.90 port 31634 ssh2
Sep 02 09:41:38 rmg-vpn-01 sshd[24667]: Connection closed by invalid user deploy 203.0.113.90 port 31634 [preauth]
Sep 02 09:41:42 rmg-vpn-01 sshd[24674]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90  user=postgres
Sep 02 09:41:44 rmg-vpn-01 sshd[24674]: Failed password for postgres from 203.0.113.90 port 38420 ssh2
Sep 02 09:41:52 rmg-vpn-01 sshd[24680]: Invalid user git from 203.0.113.90 port 37106
Sep 02 09:41:53 rmg-vpn-01 sshd[24680]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:41:53 rmg-vpn-01 sshd[24680]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:41:55 rmg-vpn-01 sshd[24680]: Failed password for invalid user git from 203.0.113.90 port 37106 ssh2
Sep 02 09:41:56 rmg-vpn-01 sshd[24680]: Connection closed by invalid user git 203.0.113.90 port 37106 [preauth]
Sep 02 09:41:57 rmg-vpn-01 sshd[24685]: Invalid user ubuntu from 203.0.113.90 port 58761
Sep 02 09:41:58 rmg-vpn-01 sshd[24685]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:41:58 rmg-vpn-01 sshd[24685]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:42:00 rmg-vpn-01 sshd[24685]: Failed password for invalid user ubuntu from 203.0.113.90 port 58761 ssh2
Sep 02 09:42:01 rmg-vpn-01 sshd[24685]: Connection closed by invalid user ubuntu 203.0.113.90 port 58761 [preauth]
Sep 02 09:42:03 rmg-vpn-01 sshd[24693]: Invalid user git from 203.0.113.90 port 47000
Sep 02 09:42:04 rmg-vpn-01 sshd[24693]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:42:04 rmg-vpn-01 sshd[24693]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:42:06 rmg-vpn-01 sshd[24693]: Failed password for invalid user git from 203.0.113.90 port 47000 ssh2
Sep 02 09:42:07 rmg-vpn-01 sshd[24693]: Connection closed by invalid user git 203.0.113.90 port 47000 [preauth]
Sep 02 09:42:09 rmg-vpn-01 sshd[24694]: Invalid user deploy from 203.0.113.90 port 61397
Sep 02 09:42:10 rmg-vpn-01 sshd[24694]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:42:10 rmg-vpn-01 sshd[24694]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:42:12 rmg-vpn-01 sshd[24694]: Failed password for invalid user deploy from 203.0.113.90 port 61397 ssh2
Sep 02 09:42:13 rmg-vpn-01 sshd[24694]: Connection closed by invalid user deploy 203.0.113.90 port 61397 [preauth]
Sep 02 09:42:14 rmg-vpn-01 sshd[24699]: Invalid user ubuntu from 203.0.113.90 port 59878
Sep 02 09:42:15 rmg-vpn-01 sshd[24699]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:42:15 rmg-vpn-01 sshd[24699]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:42:17 rmg-vpn-01 sshd[24699]: Failed password for invalid user ubuntu from 203.0.113.90 port 59878 ssh2
Sep 02 09:42:18 rmg-vpn-01 sshd[24699]: Connection closed by invalid user ubuntu 203.0.113.90 port 59878 [preauth]
Sep 02 09:42:23 rmg-vpn-01 sshd[24701]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90  user=postgres
Sep 02 09:42:25 rmg-vpn-01 sshd[23086]: Invalid user guest from 203.0.113.140 port 38254
Sep 02 09:42:25 rmg-vpn-01 sshd[24701]: Failed password for postgres from 203.0.113.90 port 55674 ssh2
Sep 02 09:42:26 rmg-vpn-01 sshd[23086]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:42:26 rmg-vpn-01 sshd[23086]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.140
Sep 02 09:42:28 rmg-vpn-01 sshd[23086]: Failed password for invalid user guest from 203.0.113.140 port 38254 ssh2
Sep 02 09:42:29 rmg-vpn-01 sshd[23086]: Connection closed by invalid user guest 203.0.113.140 port 38254 [preauth]
Sep 02 09:42:29 rmg-vpn-01 sshd[24707]: Invalid user git from 203.0.113.12 port 49016
Sep 02 09:42:30 rmg-vpn-01 sshd[24707]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:42:30 rmg-vpn-01 sshd[24707]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12
Sep 02 09:42:32 rmg-vpn-01 sshd[24707]: Failed password for invalid user git from 203.0.113.12 port 49016 ssh2
Sep 02 09:42:32 rmg-vpn-01 sshd[24715]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12  user=jdelacruz
Sep 02 09:42:33 rmg-vpn-01 sshd[24707]: Connection closed by invalid user git 203.0.113.12 port 49016 [preauth]
Sep 02 09:42:34 rmg-vpn-01 sshd[24715]: Failed password for jdelacruz from 203.0.113.12 port 57366 ssh2
Sep 02 09:42:42 rmg-vpn-01 sshd[24717]: Invalid user ubuntu from 203.0.113.88 port 56025
Sep 02 09:42:43 rmg-vpn-01 sshd[24717]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:42:43 rmg-vpn-01 sshd[24717]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.88
Sep 02 09:42:45 rmg-vpn-01 sshd[24717]: Failed password for invalid user ubuntu from 203.0.113.88 port 56025 ssh2
Sep 02 09:42:46 rmg-vpn-01 sshd[24717]: Connection closed by invalid user ubuntu 203.0.113.88 port 56025 [preauth]
Sep 02 09:42:47 rmg-vpn-01 sshd[24723]: Invalid user deploy from 203.0.113.90 port 48069
Sep 02 09:42:48 rmg-vpn-01 sshd[24723]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:42:48 rmg-vpn-01 sshd[24723]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:42:50 rmg-vpn-01 sshd[24723]: Failed password for invalid user deploy from 203.0.113.90 port 48069 ssh2
Sep 02 09:42:51 rmg-vpn-01 sshd[24723]: Connection closed by invalid user deploy 203.0.113.90 port 48069 [preauth]
Sep 02 09:42:57 rmg-vpn-01 sshd[24725]: Invalid user deploy from 203.0.113.12 port 43466
Sep 02 09:42:58 rmg-vpn-01 sshd[24725]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:42:58 rmg-vpn-01 sshd[24725]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12
Sep 02 09:43:00 rmg-vpn-01 sshd[24725]: Failed password for invalid user deploy from 203.0.113.12 port 43466 ssh2
Sep 02 09:43:01 rmg-vpn-01 sshd[24725]: Connection closed by invalid user deploy 203.0.113.12 port 43466 [preauth]
Sep 02 09:43:05 rmg-vpn-01 sshd[24729]: Invalid user oracle from 203.0.113.90 port 64685
Sep 02 09:43:06 rmg-vpn-01 sshd[24729]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:43:06 rmg-vpn-01 sshd[24729]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:43:08 rmg-vpn-01 sshd[24729]: Failed password for invalid user oracle from 203.0.113.90 port 64685 ssh2
Sep 02 09:43:09 rmg-vpn-01 sshd[24729]: Connection closed by invalid user oracle 203.0.113.90 port 64685 [preauth]
Sep 02 09:43:15 rmg-vpn-01 sshd[24738]: Invalid user deploy from 198.51.100.77 port 31707
Sep 02 09:43:16 rmg-vpn-01 sshd[24738]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:43:16 rmg-vpn-01 sshd[24738]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.77
Sep 02 09:43:18 rmg-vpn-01 sshd[24738]: Failed password for invalid user deploy from 198.51.100.77 port 31707 ssh2
Sep 02 09:43:19 rmg-vpn-01 sshd[24738]: Connection closed by invalid user deploy 198.51.100.77 port 31707 [preauth]
Sep 02 09:43:19 rmg-vpn-01 sshd[24744]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90  user=postgres
Sep 02 09:43:21 rmg-vpn-01 sshd[24744]: Failed password for postgres from 203.0.113.90 port 31133 ssh2
Sep 02 09:43:24 rmg-vpn-01 sshd[24750]: Invalid user ubuntu from 203.0.113.90 port 32120
Sep 02 09:43:25 rmg-vpn-01 sshd[24750]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:43:25 rmg-vpn-01 sshd[24750]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:43:27 rmg-vpn-01 sshd[24750]: Failed password for invalid user ubuntu from 203.0.113.90 port 32120 ssh2
Sep 02 09:43:28 rmg-vpn-01 sshd[24750]: Connection closed by invalid user ubuntu 203.0.113.90 port 32120 [preauth]
Sep 02 09:43:28 rmg-vpn-01 sshd[24754]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90  user=root
Sep 02 09:43:30 rmg-vpn-01 sshd[24754]: Failed password for root from 203.0.113.90 port 35827 ssh2
Sep 02 09:43:37 rmg-vpn-01 sshd[24756]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90  user=postgres
Sep 02 09:43:39 rmg-vpn-01 sshd[24756]: Failed password for postgres from 203.0.113.90 port 38697 ssh2
Sep 02 09:43:45 rmg-vpn-01 sshd[24759]: Invalid user git from 203.0.113.90 port 60640
Sep 02 09:43:46 rmg-vpn-01 sshd[24759]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:43:46 rmg-vpn-01 sshd[24759]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:43:48 rmg-vpn-01 sshd[24759]: Failed password for invalid user git from 203.0.113.90 port 60640 ssh2
Sep 02 09:43:49 rmg-vpn-01 sshd[24759]: Connection closed by invalid user git 203.0.113.90 port 60640 [preauth]
Sep 02 09:43:56 rmg-vpn-01 sshd[24765]: Invalid user git from 203.0.113.90 port 47000
Sep 02 09:43:57 rmg-vpn-01 sshd[24765]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:43:57 rmg-vpn-01 sshd[24765]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:43:59 rmg-vpn-01 sshd[24765]: Failed password for invalid user git from 203.0.113.90 port 47000 ssh2
Sep 02 09:44:00 rmg-vpn-01 sshd[24765]: Connection closed by invalid user git 203.0.113.90 port 47000 [preauth]
Sep 02 09:44:06 rmg-vpn-01 sshd[24768]: Invalid user oracle from 203.0.113.12 port 37538
Sep 02 09:44:07 rmg-vpn-01 sshd[24768]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:44:07 rmg-vpn-01 sshd[24768]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12
Sep 02 09:44:09 rmg-vpn-01 sshd[24768]: Failed password for invalid user oracle from 203.0.113.12 port 37538 ssh2
Sep 02 09:44:10 rmg-vpn-01 sshd[24768]: Connection closed by invalid user oracle 203.0.113.12 port 37538 [preauth]
Sep 02 09:44:15 rmg-vpn-01 sshd[24774]: Invalid user oracle from 203.0.113.88 port 56244
Sep 02 09:44:16 rmg-vpn-01 sshd[24774]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:44:16 rmg-vpn-01 sshd[24774]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.88
Sep 02 09:44:18 rmg-vpn-01 sshd[24774]: Failed password for invalid user oracle from 203.0.113.88 port 56244 ssh2
Sep 02 09:44:19 rmg-vpn-01 sshd[24774]: Connection closed by invalid user oracle 203.0.113.88 port 56244 [preauth]
Sep 02 09:44:24 rmg-vpn-01 sshd[24777]: Invalid user deploy from 203.0.113.90 port 62614
Sep 02 09:44:25 rmg-vpn-01 sshd[24777]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:44:25 rmg-vpn-01 sshd[24777]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:44:27 rmg-vpn-01 sshd[24777]: Failed password for invalid user deploy from 203.0.113.90 port 62614 ssh2
Sep 02 09:44:28 rmg-vpn-01 sshd[24777]: Connection closed by invalid user deploy 203.0.113.90 port 62614 [preauth]
Sep 02 09:44:32 rmg-vpn-01 sshd[24782]: Invalid user oracle from 203.0.113.90 port 52530
Sep 02 09:44:33 rmg-vpn-01 sshd[24782]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:44:33 rmg-vpn-01 sshd[24782]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:44:35 rmg-vpn-01 sshd[24782]: Failed password for invalid user oracle from 203.0.113.90 port 52530 ssh2
Sep 02 09:44:36 rmg-vpn-01 sshd[24782]: Connection closed by invalid user oracle 203.0.113.90 port 52530 [preauth]
Sep 02 09:44:36 rmg-vpn-01 sshd[24788]: Invalid user ubuntu from 203.0.113.90 port 51179
Sep 02 09:44:37 rmg-vpn-01 sshd[24788]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:44:37 rmg-vpn-01 sshd[24788]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:44:39 rmg-vpn-01 sshd[24788]: Failed password for invalid user ubuntu from 203.0.113.90 port 51179 ssh2
Sep 02 09:44:39 rmg-vpn-01 sshd[24795]: Invalid user git from 203.0.113.90 port 57367
Sep 02 09:44:40 rmg-vpn-01 sshd[24788]: Connection closed by invalid user ubuntu 203.0.113.90 port 51179 [preauth]
Sep 02 09:44:40 rmg-vpn-01 sshd[24795]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:44:40 rmg-vpn-01 sshd[24795]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:44:42 rmg-vpn-01 sshd[24795]: Failed password for invalid user git from 203.0.113.90 port 57367 ssh2
Sep 02 09:44:43 rmg-vpn-01 sshd[24795]: Connection closed by invalid user git 203.0.113.90 port 57367 [preauth]
Sep 02 09:44:47 rmg-vpn-01 sshd[24802]: Invalid user git from 203.0.113.90 port 52245
Sep 02 09:44:48 rmg-vpn-01 sshd[24802]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:44:48 rmg-vpn-01 sshd[24802]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:44:50 rmg-vpn-01 sshd[24802]: Failed password for invalid user git from 203.0.113.90 port 52245 ssh2
Sep 02 09:44:50 rmg-vpn-01 sshd[24811]: Invalid user test from 203.0.113.90 port 59363
Sep 02 09:44:51 rmg-vpn-01 sshd[24802]: Connection closed by invalid user git 203.0.113.90 port 52245 [preauth]
Sep 02 09:44:51 rmg-vpn-01 sshd[24811]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:44:51 rmg-vpn-01 sshd[24811]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:44:53 rmg-vpn-01 sshd[24811]: Failed password for invalid user test from 203.0.113.90 port 59363 ssh2
Sep 02 09:44:54 rmg-vpn-01 sshd[24811]: Connection closed by invalid user test 203.0.113.90 port 59363 [preauth]
Sep 02 09:45:01 rmg-vpn-01 sshd[24817]: Invalid user deploy from 198.51.100.77 port 61219
Sep 02 09:45:02 rmg-vpn-01 sshd[24817]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:45:02 rmg-vpn-01 sshd[24817]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.77
Sep 02 09:45:04 rmg-vpn-01 sshd[24817]: Failed password for invalid user deploy from 198.51.100.77 port 61219 ssh2
Sep 02 09:45:05 rmg-vpn-01 sshd[24817]: Connection closed by invalid user deploy 198.51.100.77 port 61219 [preauth]
Sep 02 09:45:10 rmg-vpn-01 sshd[24818]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12  user=jdelacruz
Sep 02 09:45:12 rmg-vpn-01 sshd[24818]: Failed password for jdelacruz from 203.0.113.12 port 63227 ssh2
Sep 02 09:45:17 rmg-vpn-01 sshd[24822]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.88  user=postgres
Sep 02 09:45:19 rmg-vpn-01 sshd[24822]: Failed password for postgres from 203.0.113.88 port 63353 ssh2
Sep 02 09:45:24 rmg-vpn-01 sshd[24827]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90  user=jdelacruz
Sep 02 09:45:26 rmg-vpn-01 sshd[24827]: Failed password for jdelacruz from 203.0.113.90 port 42522 ssh2
Sep 02 09:45:30 rmg-vpn-01 sshd[22019]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 09:45:32 rmg-vpn-01 sshd[22019]: Failed password for nagios from 10.20.9.40 port 56058 ssh2
Sep 02 09:45:32 rmg-vpn-01 sshd[24829]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90  user=root
Sep 02 09:45:34 rmg-vpn-01 sshd[24829]: Failed password for root from 203.0.113.90 port 42466 ssh2
Sep 02 09:45:43 rmg-vpn-01 sshd[24831]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.77  user=root
Sep 02 09:45:45 rmg-vpn-01 sshd[24831]: Failed password for root from 198.51.100.77 port 38746 ssh2
Sep 02 09:45:51 rmg-vpn-01 sshd[24835]: Invalid user git from 203.0.113.90 port 46731
Sep 02 09:45:52 rmg-vpn-01 sshd[24835]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:45:52 rmg-vpn-01 sshd[24835]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:45:54 rmg-vpn-01 sshd[24835]: Failed password for invalid user git from 203.0.113.90 port 46731 ssh2
Sep 02 09:45:54 rmg-vpn-01 sshd[24838]: Invalid user test from 198.51.100.77 port 41920
Sep 02 09:45:55 rmg-vpn-01 sshd[24835]: Connection closed by invalid user git 203.0.113.90 port 46731 [preauth]
Sep 02 09:45:55 rmg-vpn-01 sshd[24838]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:45:55 rmg-vpn-01 sshd[24838]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.77
Sep 02 09:45:57 rmg-vpn-01 sshd[24838]: Failed password for invalid user test from 198.51.100.77 port 41920 ssh2
Sep 02 09:45:57 rmg-vpn-01 sshd[24842]: Invalid user oracle from 203.0.113.88 port 53989
Sep 02 09:45:58 rmg-vpn-01 sshd[24838]: Connection closed by invalid user test 198.51.100.77 port 41920 [preauth]
Sep 02 09:45:58 rmg-vpn-01 sshd[24842]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:45:58 rmg-vpn-01 sshd[24842]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.88
Sep 02 09:46:00 rmg-vpn-01 sshd[24842]: Failed password for invalid user oracle from 203.0.113.88 port 53989 ssh2
Sep 02 09:46:01 rmg-vpn-01 sshd[24842]: Connection closed by invalid user oracle 203.0.113.88 port 53989 [preauth]
Sep 02 09:46:03 rmg-vpn-01 sshd[24848]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90  user=jdelacruz
Sep 02 09:46:05 rmg-vpn-01 sshd[24848]: Failed password for jdelacruz from 203.0.113.90 port 34544 ssh2
Sep 02 09:46:12 rmg-vpn-01 sshd[24854]: Invalid user ubuntu from 203.0.113.88 port 48813
Sep 02 09:46:13 rmg-vpn-01 sshd[24854]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:46:13 rmg-vpn-01 sshd[24854]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.88
Sep 02 09:46:15 rmg-vpn-01 sshd[24854]: Failed password for invalid user ubuntu from 203.0.113.88 port 48813 ssh2
Sep 02 09:46:16 rmg-vpn-01 sshd[24854]: Connection closed by invalid user ubuntu 203.0.113.88 port 48813 [preauth]
Sep 02 09:46:18 rmg-vpn-01 sshd[24860]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90  user=root
Sep 02 09:46:20 rmg-vpn-01 sshd[24860]: Failed password for root from 203.0.113.90 port 33015 ssh2
Sep 02 09:46:25 rmg-vpn-01 sshd[24868]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12  user=jdelacruz
Sep 02 09:46:27 rmg-vpn-01 sshd[24868]: Failed password for jdelacruz from 203.0.113.12 port 59133 ssh2
Sep 02 09:46:30 rmg-vpn-01 sshd[24874]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90  user=jdelacruz
Sep 02 09:46:32 rmg-vpn-01 sshd[24874]: Failed password for jdelacruz from 203.0.113.90 port 46824 ssh2
Sep 02 09:46:40 rmg-vpn-01 sshd[24878]: Invalid user git from 203.0.113.90 port 38316
Sep 02 09:46:41 rmg-vpn-01 sshd[24878]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:46:41 rmg-vpn-01 sshd[24878]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:46:43 rmg-vpn-01 sshd[24878]: Failed password for invalid user git from 203.0.113.90 port 38316 ssh2
Sep 02 09:46:43 rmg-vpn-01 sshd[24884]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.88  user=jdelacruz
Sep 02 09:46:44 rmg-vpn-01 sshd[24878]: Connection closed by invalid user git 203.0.113.90 port 38316 [preauth]
Sep 02 09:46:45 rmg-vpn-01 sshd[24884]: Failed password for jdelacruz from 203.0.113.88 port 39962 ssh2
Sep 02 09:46:52 rmg-vpn-01 sshd[24885]: Invalid user ubuntu from 203.0.113.90 port 48779
Sep 02 09:46:53 rmg-vpn-01 sshd[24885]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:46:53 rmg-vpn-01 sshd[24885]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:46:55 rmg-vpn-01 sshd[24885]: Failed password for invalid user ubuntu from 203.0.113.90 port 48779 ssh2
Sep 02 09:46:56 rmg-vpn-01 sshd[24885]: Connection closed by invalid user ubuntu 203.0.113.90 port 48779 [preauth]
Sep 02 09:46:59 rmg-vpn-01 sshd[24889]: Invalid user oracle from 203.0.113.90 port 41249
Sep 02 09:47:00 rmg-vpn-01 sshd[24889]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:47:00 rmg-vpn-01 sshd[24889]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.90
Sep 02 09:47:02 rmg-vpn-01 sshd[24889]: Failed password for invalid user oracle from 203.0.113.90 port 41249 ssh2
Sep 02 09:47:03 rmg-vpn-01 sshd[24889]: Connection closed by invalid user oracle 203.0.113.90 port 41249 [preauth]
Sep 02 09:49:09 rmg-vpn-01 sshd[23079]: Invalid user oracle from 198.51.100.23 port 30423
Sep 02 09:49:10 rmg-vpn-01 sshd[23079]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:49:10 rmg-vpn-01 sshd[23079]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.23
Sep 02 09:49:12 rmg-vpn-01 sshd[23079]: Failed password for invalid user oracle from 198.51.100.23 port 30423 ssh2
Sep 02 09:49:13 rmg-vpn-01 sshd[23079]: Connection closed by invalid user oracle 198.51.100.23 port 30423 [preauth]
Sep 02 09:50:11 rmg-vpn-01 sshd[22024]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 09:50:13 rmg-vpn-01 sshd[22024]: Failed password for nagios from 10.20.9.40 port 62504 ssh2
Sep 02 09:55:14 rmg-vpn-01 sshd[22027]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 09:55:16 rmg-vpn-01 sshd[22027]: Failed password for nagios from 10.20.9.40 port 60832 ssh2
Sep 02 09:55:51 rmg-vpn-01 sshd[23075]: Invalid user deploy from 192.0.2.171 port 44444
Sep 02 09:55:52 rmg-vpn-01 sshd[23075]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 09:55:52 rmg-vpn-01 sshd[23075]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=192.0.2.171
Sep 02 09:55:54 rmg-vpn-01 sshd[23075]: Failed password for invalid user deploy from 192.0.2.171 port 44444 ssh2
Sep 02 09:55:55 rmg-vpn-01 sshd[23075]: Connection closed by invalid user deploy 192.0.2.171 port 44444 [preauth]
Sep 02 10:00:22 rmg-vpn-01 sshd[22036]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 10:00:24 rmg-vpn-01 sshd[22036]: Failed password for nagios from 10.20.9.40 port 52546 ssh2
Sep 02 10:04:32 rmg-vpn-01 sshd[23096]: Invalid user user from 192.0.2.9 port 45057
Sep 02 10:04:33 rmg-vpn-01 sshd[23096]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 10:04:33 rmg-vpn-01 sshd[23096]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=192.0.2.9
Sep 02 10:04:35 rmg-vpn-01 sshd[23096]: Failed password for invalid user user from 192.0.2.9 port 45057 ssh2
Sep 02 10:04:36 rmg-vpn-01 sshd[23096]: Connection closed by invalid user user 192.0.2.9 port 45057 [preauth]
Sep 02 10:05:16 rmg-vpn-01 sshd[22042]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 10:05:18 rmg-vpn-01 sshd[22042]: Failed password for nagios from 10.20.9.40 port 57711 ssh2
Sep 02 10:10:08 rmg-vpn-01 sshd[22044]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 10:10:10 rmg-vpn-01 sshd[22044]: Failed password for nagios from 10.20.9.40 port 50756 ssh2
Sep 02 10:14:22 rmg-vpn-01 sshd[24895]: Accepted password for jdelacruz from 203.0.113.90 port 53470 ssh2
Sep 02 10:14:23 rmg-vpn-01 sshd[24895]: pam_unix(sshd:session): session opened for user jdelacruz(uid=1004) by (uid=0)
Sep 02 10:15:03 rmg-vpn-01 sshd[22049]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 10:15:05 rmg-vpn-01 sshd[22049]: Failed password for nagios from 10.20.9.40 port 46369 ssh2
Sep 02 10:17:01 rmg-vpn-01 CRON[14400]: pam_unix(cron:session): session opened for user root(uid=0) by (uid=0)
Sep 02 10:17:01 rmg-vpn-01 CRON[9933]: pam_unix(cron:session): session closed for user root
Sep 02 10:20:26 rmg-vpn-01 sshd[22051]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 10:20:28 rmg-vpn-01 sshd[22051]: Failed password for nagios from 10.20.9.40 port 53013 ssh2
Sep 02 10:22:41 rmg-vpn-01 sudo:  jdelacruz : TTY=pts/1 ; PWD=/home/jdelacruz ; USER=root ; COMMAND=/usr/sbin/useradd -m -s /bin/bash -u 1501 svc-report
Sep 02 10:22:41 rmg-vpn-01 sudo: pam_unix(sudo:session): session opened for user root(uid=0) by jdelacruz(uid=1004)
Sep 02 10:22:42 rmg-vpn-01 useradd[25340]: new group: name=svc-report, GID=1501
Sep 02 10:22:42 rmg-vpn-01 useradd[25340]: new user: name=svc-report, UID=1501, GID=1501, home=/home/svc-report, shell=/bin/bash
Sep 02 10:22:44 rmg-vpn-01 sudo: pam_unix(sudo:session): session closed for user root
Sep 02 10:23:18 rmg-vpn-01 passwd[25361]: password for 'svc-report' changed by 'root'
Sep 02 10:25:07 rmg-vpn-01 sshd[22059]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 10:25:09 rmg-vpn-01 sshd[22059]: Failed password for nagios from 10.20.9.40 port 47510 ssh2
Sep 02 10:30:18 rmg-vpn-01 sshd[22065]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 10:30:20 rmg-vpn-01 sshd[22065]: Failed password for nagios from 10.20.9.40 port 55544 ssh2
Sep 02 10:31:05 rmg-vpn-01 sudo:  jdelacruz : TTY=pts/1 ; PWD=/home/jdelacruz ; USER=root ; COMMAND=/usr/sbin/usermod -aG sudo svc-report
Sep 02 10:31:05 rmg-vpn-01 sudo: pam_unix(sudo:session): session opened for user root(uid=0) by jdelacruz(uid=1004)
Sep 02 10:31:06 rmg-vpn-01 usermod[25402]: add 'svc-report' to group 'sudo'
Sep 02 10:31:06 rmg-vpn-01 usermod[25402]: add 'svc-report' to shadow group 'sudo'
Sep 02 10:31:08 rmg-vpn-01 sudo: pam_unix(sudo:session): session closed for user root
Sep 02 10:35:10 rmg-vpn-01 sshd[22073]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 10:35:12 rmg-vpn-01 sshd[22073]: Failed password for nagios from 10.20.9.40 port 42444 ssh2
Sep 02 10:39:02 rmg-vpn-01 sshd[23105]: Invalid user pi from 203.0.113.12 port 50112
Sep 02 10:39:03 rmg-vpn-01 sshd[23105]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 10:39:03 rmg-vpn-01 sshd[23105]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12
Sep 02 10:39:05 rmg-vpn-01 sshd[23105]: Failed password for invalid user pi from 203.0.113.12 port 50112 ssh2
Sep 02 10:39:06 rmg-vpn-01 sshd[23105]: Connection closed by invalid user pi 203.0.113.12 port 50112 [preauth]
Sep 02 10:40:12 rmg-vpn-01 crontab[25455]: (svc-report) BEGIN EDIT (svc-report)
Sep 02 10:40:21 rmg-vpn-01 sshd[22078]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 10:40:23 rmg-vpn-01 sshd[22078]: Failed password for nagios from 10.20.9.40 port 62279 ssh2
Sep 02 10:40:51 rmg-vpn-01 crontab[25455]: (svc-report) REPLACE (svc-report)
Sep 02 10:40:51 rmg-vpn-01 crontab[25455]: (svc-report) END EDIT (svc-report)
Sep 02 10:45:08 rmg-vpn-01 sshd[22079]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 10:45:10 rmg-vpn-01 sshd[22079]: Failed password for nagios from 10.20.9.40 port 41466 ssh2
Sep 02 10:47:53 rmg-vpn-01 sshd[23102]: Invalid user git from 192.0.2.9 port 61640
Sep 02 10:47:54 rmg-vpn-01 sshd[23102]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 10:47:54 rmg-vpn-01 sshd[23102]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=192.0.2.9
Sep 02 10:47:56 rmg-vpn-01 sshd[23102]: Failed password for invalid user git from 192.0.2.9 port 61640 ssh2
Sep 02 10:47:57 rmg-vpn-01 sshd[23102]: Connection closed by invalid user git 192.0.2.9 port 61640 [preauth]
Sep 02 10:50:27 rmg-vpn-01 sshd[22083]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 10:50:29 rmg-vpn-01 sshd[22083]: Failed password for nagios from 10.20.9.40 port 58681 ssh2
Sep 02 10:51:53 rmg-vpn-01 sshd[23099]: Invalid user jenkins from 198.51.100.202 port 60469
Sep 02 10:51:54 rmg-vpn-01 sshd[23099]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 10:51:54 rmg-vpn-01 sshd[23099]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.202
Sep 02 10:51:56 rmg-vpn-01 sshd[23099]: Failed password for invalid user jenkins from 198.51.100.202 port 60469 ssh2
Sep 02 10:51:57 rmg-vpn-01 sshd[23099]: Connection closed by invalid user jenkins 198.51.100.202 port 60469 [preauth]
Sep 02 10:52:30 rmg-vpn-01 sshd[24895]: pam_unix(sshd:session): session closed for user jdelacruz
Sep 02 10:55:14 rmg-vpn-01 sshd[22092]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 10:55:16 rmg-vpn-01 sshd[22092]: Failed password for nagios from 10.20.9.40 port 42879 ssh2
Sep 02 10:55:39 rmg-vpn-01 sshd[23104]: Invalid user oracle from 192.0.2.44 port 60448
Sep 02 10:55:40 rmg-vpn-01 sshd[23104]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 10:55:40 rmg-vpn-01 sshd[23104]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=192.0.2.44
Sep 02 10:55:42 rmg-vpn-01 sshd[23104]: Failed password for invalid user oracle from 192.0.2.44 port 60448 ssh2
Sep 02 10:55:43 rmg-vpn-01 sshd[23104]: Connection closed by invalid user oracle 192.0.2.44 port 60448 [preauth]
Sep 02 11:00:12 rmg-vpn-01 sshd[22096]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 11:00:14 rmg-vpn-01 sshd[22096]: Failed password for nagios from 10.20.9.40 port 30345 ssh2
Sep 02 11:03:06 rmg-vpn-01 sshd[23112]: Invalid user mysql from 198.51.100.23 port 41989
Sep 02 11:03:07 rmg-vpn-01 sshd[23112]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 11:03:07 rmg-vpn-01 sshd[23112]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.23
Sep 02 11:03:09 rmg-vpn-01 sshd[23112]: Failed password for invalid user mysql from 198.51.100.23 port 41989 ssh2
Sep 02 11:03:10 rmg-vpn-01 sshd[23112]: Connection closed by invalid user mysql 198.51.100.23 port 41989 [preauth]
Sep 02 11:05:14 rmg-vpn-01 sshd[22103]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 11:05:14 rmg-vpn-01 sshd[24902]: Accepted publickey for svc-report from 203.0.113.90 port 62557 ssh2
Sep 02 11:05:15 rmg-vpn-01 sshd[24902]: pam_unix(sshd:session): session opened for user svc-report(uid=1501) by (uid=0)
Sep 02 11:05:16 rmg-vpn-01 sshd[22103]: Failed password for nagios from 10.20.9.40 port 49788 ssh2
Sep 02 11:06:02 rmg-vpn-01 sudo:  svc-report : TTY=pts/3 ; PWD=/var/www/portal ; USER=root ; COMMAND=/bin/tar -czf /tmp/.cache/pt.tar.gz /var/www/portal/exports
Sep 02 11:06:02 rmg-vpn-01 sudo: pam_unix(sudo:session): session opened for user root(uid=0) by svc-report(uid=1501)
Sep 02 11:09:40 rmg-vpn-01 sudo: pam_unix(sudo:session): session closed for user root
Sep 02 11:10:05 rmg-vpn-01 sshd[22108]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 11:10:07 rmg-vpn-01 sshd[22108]: Failed password for nagios from 10.20.9.40 port 52935 ssh2
Sep 02 11:15:05 rmg-vpn-01 sshd[22114]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 11:15:07 rmg-vpn-01 sshd[22114]: Failed password for nagios from 10.20.9.40 port 37976 ssh2
Sep 02 11:17:01 rmg-vpn-01 CRON[9949]: pam_unix(cron:session): session opened for user root(uid=0) by (uid=0)
Sep 02 11:17:01 rmg-vpn-01 CRON[13418]: pam_unix(cron:session): session closed for user root
Sep 02 11:20:00 rmg-vpn-01 sshd[22117]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 11:20:02 rmg-vpn-01 sshd[22117]: Failed password for nagios from 10.20.9.40 port 48445 ssh2
Sep 02 11:25:27 rmg-vpn-01 sshd[22118]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 11:25:29 rmg-vpn-01 sshd[22118]: Failed password for nagios from 10.20.9.40 port 31710 ssh2
Sep 02 11:26:34 rmg-vpn-01 sshd[23120]: Invalid user ubuntu from 203.0.113.201 port 32509
Sep 02 11:26:35 rmg-vpn-01 sshd[23120]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 11:26:35 rmg-vpn-01 sshd[23120]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.201
Sep 02 11:26:37 rmg-vpn-01 sshd[23120]: Failed password for invalid user ubuntu from 203.0.113.201 port 32509 ssh2
Sep 02 11:26:38 rmg-vpn-01 sshd[23120]: Connection closed by invalid user ubuntu 203.0.113.201 port 32509 [preauth]
Sep 02 11:30:24 rmg-vpn-01 sshd[22126]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 11:30:26 rmg-vpn-01 sshd[22126]: Failed password for nagios from 10.20.9.40 port 51855 ssh2
Sep 02 11:31:55 rmg-vpn-01 sshd[24902]: pam_unix(sshd:session): session closed for user svc-report
Sep 02 11:35:06 rmg-vpn-01 sshd[22134]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 11:35:08 rmg-vpn-01 sshd[22134]: Failed password for nagios from 10.20.9.40 port 37394 ssh2
Sep 02 11:40:04 rmg-vpn-01 sshd[22136]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 11:40:06 rmg-vpn-01 sshd[22136]: Failed password for nagios from 10.20.9.40 port 40268 ssh2
Sep 02 11:45:09 rmg-vpn-01 sshd[22145]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 11:45:11 rmg-vpn-01 sshd[22145]: Failed password for nagios from 10.20.9.40 port 44278 ssh2
Sep 02 11:47:03 rmg-vpn-01 sshd[23417]: pam_unix(sshd:session): session closed for user dokafor
Sep 02 11:50:00 rmg-vpn-01 sshd[22149]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 11:50:02 rmg-vpn-01 sshd[22149]: Failed password for nagios from 10.20.9.40 port 48930 ssh2
Sep 02 11:50:39 rmg-vpn-01 sshd[23106]: Invalid user user from 203.0.113.12 port 62192
Sep 02 11:50:40 rmg-vpn-01 sshd[23106]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 11:50:40 rmg-vpn-01 sshd[23106]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12
Sep 02 11:50:42 rmg-vpn-01 sshd[23106]: Failed password for invalid user user from 203.0.113.12 port 62192 ssh2
Sep 02 11:50:43 rmg-vpn-01 sshd[23106]: Connection closed by invalid user user 203.0.113.12 port 62192 [preauth]
Sep 02 11:55:00 rmg-vpn-01 sshd[22151]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 11:55:02 rmg-vpn-01 sshd[22151]: Failed password for nagios from 10.20.9.40 port 36663 ssh2
Sep 02 12:00:14 rmg-vpn-01 sshd[22153]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 12:00:16 rmg-vpn-01 sshd[22153]: Failed password for nagios from 10.20.9.40 port 50775 ssh2
Sep 02 12:05:24 rmg-vpn-01 sshd[22157]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 12:05:26 rmg-vpn-01 sshd[22157]: Failed password for nagios from 10.20.9.40 port 37901 ssh2
Sep 02 12:08:14 rmg-vpn-01 sshd[23133]: Invalid user oracle from 203.0.113.140 port 60342
Sep 02 12:08:15 rmg-vpn-01 sshd[23133]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 12:08:15 rmg-vpn-01 sshd[23133]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.140
Sep 02 12:08:17 rmg-vpn-01 sshd[23133]: Failed password for invalid user oracle from 203.0.113.140 port 60342 ssh2
Sep 02 12:08:18 rmg-vpn-01 sshd[23133]: Connection closed by invalid user oracle 203.0.113.140 port 60342 [preauth]
Sep 02 12:10:30 rmg-vpn-01 sshd[22160]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 12:10:32 rmg-vpn-01 sshd[22160]: Failed password for nagios from 10.20.9.40 port 34059 ssh2
Sep 02 12:15:14 rmg-vpn-01 sshd[22167]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 12:15:16 rmg-vpn-01 sshd[22167]: Failed password for nagios from 10.20.9.40 port 64358 ssh2
Sep 02 12:17:01 rmg-vpn-01 CRON[26284]: pam_unix(cron:session): session opened for user root(uid=0) by (uid=0)
Sep 02 12:17:01 rmg-vpn-01 CRON[11744]: pam_unix(cron:session): session closed for user root
Sep 02 12:19:31 rmg-vpn-01 sshd[23138]: Invalid user oracle from 192.0.2.171 port 57283
Sep 02 12:19:32 rmg-vpn-01 sshd[23138]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 12:19:32 rmg-vpn-01 sshd[23138]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=192.0.2.171
Sep 02 12:19:34 rmg-vpn-01 sshd[23138]: Failed password for invalid user oracle from 192.0.2.171 port 57283 ssh2
Sep 02 12:19:35 rmg-vpn-01 sshd[23138]: Connection closed by invalid user oracle 192.0.2.171 port 57283 [preauth]
Sep 02 12:20:17 rmg-vpn-01 sshd[22169]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 12:20:19 rmg-vpn-01 sshd[22169]: Failed password for nagios from 10.20.9.40 port 59378 ssh2
Sep 02 12:23:57 rmg-vpn-01 sshd[23144]: Invalid user ftpuser from 203.0.113.201 port 53460
Sep 02 12:23:58 rmg-vpn-01 sshd[23144]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 12:23:58 rmg-vpn-01 sshd[23144]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.201
Sep 02 12:24:00 rmg-vpn-01 sshd[23144]: Failed password for invalid user ftpuser from 203.0.113.201 port 53460 ssh2
Sep 02 12:24:01 rmg-vpn-01 sshd[23144]: Connection closed by invalid user ftpuser 203.0.113.201 port 53460 [preauth]
Sep 02 12:25:07 rmg-vpn-01 sshd[22178]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 12:25:09 rmg-vpn-01 sshd[22178]: Failed password for nagios from 10.20.9.40 port 60491 ssh2
Sep 02 12:28:55 rmg-vpn-01 sshd[23154]: Invalid user webmaster from 203.0.113.140 port 55726
Sep 02 12:28:56 rmg-vpn-01 sshd[23154]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 12:28:56 rmg-vpn-01 sshd[23154]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.140
Sep 02 12:28:58 rmg-vpn-01 sshd[23154]: Failed password for invalid user webmaster from 203.0.113.140 port 55726 ssh2
Sep 02 12:28:59 rmg-vpn-01 sshd[23154]: Connection closed by invalid user webmaster 203.0.113.140 port 55726 [preauth]
Sep 02 12:30:25 rmg-vpn-01 sshd[22180]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 12:30:27 rmg-vpn-01 sshd[22180]: Failed password for nagios from 10.20.9.40 port 50647 ssh2
Sep 02 12:30:56 rmg-vpn-01 sshd[23147]: Invalid user ubuntu from 198.51.100.202 port 55239
Sep 02 12:30:57 rmg-vpn-01 sshd[23147]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 12:30:57 rmg-vpn-01 sshd[23147]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.202
Sep 02 12:30:59 rmg-vpn-01 sshd[23147]: Failed password for invalid user ubuntu from 198.51.100.202 port 55239 ssh2
Sep 02 12:31:00 rmg-vpn-01 sshd[23147]: Connection closed by invalid user ubuntu 198.51.100.202 port 55239 [preauth]
Sep 02 12:32:51 rmg-vpn-01 sshd[23129]: Invalid user admin from 203.0.113.201 port 30687
Sep 02 12:32:52 rmg-vpn-01 sshd[23129]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 12:32:52 rmg-vpn-01 sshd[23129]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.201
Sep 02 12:32:54 rmg-vpn-01 sshd[23129]: Failed password for invalid user admin from 203.0.113.201 port 30687 ssh2
Sep 02 12:32:55 rmg-vpn-01 sshd[23129]: Connection closed by invalid user admin 203.0.113.201 port 30687 [preauth]
Sep 02 12:35:30 rmg-vpn-01 sshd[22182]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 12:35:32 rmg-vpn-01 sshd[22182]: Failed password for nagios from 10.20.9.40 port 49481 ssh2
Sep 02 12:40:21 rmg-vpn-01 sshd[22191]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 12:40:23 rmg-vpn-01 sshd[22191]: Failed password for nagios from 10.20.9.40 port 38761 ssh2
Sep 02 12:45:23 rmg-vpn-01 sshd[22196]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 12:45:25 rmg-vpn-01 sshd[22196]: Failed password for nagios from 10.20.9.40 port 64708 ssh2
Sep 02 12:50:01 rmg-vpn-01 sshd[22201]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 12:50:03 rmg-vpn-01 sshd[22201]: Failed password for nagios from 10.20.9.40 port 40362 ssh2
Sep 02 12:55:04 rmg-vpn-01 sshd[22202]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 12:55:06 rmg-vpn-01 sshd[22202]: Failed password for nagios from 10.20.9.40 port 35962 ssh2
Sep 02 13:00:00 rmg-vpn-01 sshd[22204]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 13:00:02 rmg-vpn-01 sshd[22204]: Failed password for nagios from 10.20.9.40 port 33902 ssh2
Sep 02 13:04:38 rmg-vpn-01 sshd[23172]: Invalid user ftpuser from 192.0.2.44 port 38224
Sep 02 13:04:39 rmg-vpn-01 sshd[23172]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 13:04:39 rmg-vpn-01 sshd[23172]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=192.0.2.44
Sep 02 13:04:41 rmg-vpn-01 sshd[23172]: Failed password for invalid user ftpuser from 192.0.2.44 port 38224 ssh2
Sep 02 13:04:42 rmg-vpn-01 sshd[23172]: Connection closed by invalid user ftpuser 192.0.2.44 port 38224 [preauth]
Sep 02 13:05:09 rmg-vpn-01 sshd[22205]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 13:05:11 rmg-vpn-01 sshd[22205]: Failed password for nagios from 10.20.9.40 port 31236 ssh2
Sep 02 13:10:12 rmg-vpn-01 sshd[22207]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 13:10:14 rmg-vpn-01 sshd[22207]: Failed password for nagios from 10.20.9.40 port 33037 ssh2
Sep 02 13:15:23 rmg-vpn-01 sshd[22210]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 13:15:25 rmg-vpn-01 sshd[22210]: Failed password for nagios from 10.20.9.40 port 48728 ssh2
Sep 02 13:17:01 rmg-vpn-01 CRON[26858]: pam_unix(cron:session): session opened for user root(uid=0) by (uid=0)
Sep 02 13:17:01 rmg-vpn-01 CRON[14495]: pam_unix(cron:session): session closed for user root
Sep 02 13:20:10 rmg-vpn-01 sshd[22214]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 13:20:12 rmg-vpn-01 sshd[22214]: Failed password for nagios from 10.20.9.40 port 46909 ssh2
Sep 02 13:25:00 rmg-vpn-01 sshd[22220]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 13:25:02 rmg-vpn-01 sshd[22220]: Failed password for nagios from 10.20.9.40 port 35972 ssh2
Sep 02 13:30:09 rmg-vpn-01 sshd[22229]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 13:30:11 rmg-vpn-01 sshd[22229]: Failed password for nagios from 10.20.9.40 port 47085 ssh2
Sep 02 13:34:38 rmg-vpn-01 sshd[23174]: Invalid user test from 203.0.113.201 port 38459
Sep 02 13:34:39 rmg-vpn-01 sshd[23174]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 13:34:39 rmg-vpn-01 sshd[23174]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.201
Sep 02 13:34:41 rmg-vpn-01 sshd[23174]: Failed password for invalid user test from 203.0.113.201 port 38459 ssh2
Sep 02 13:34:42 rmg-vpn-01 sshd[23174]: Connection closed by invalid user test 203.0.113.201 port 38459 [preauth]
Sep 02 13:35:06 rmg-vpn-01 sshd[22235]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 13:35:08 rmg-vpn-01 sshd[22235]: Failed password for nagios from 10.20.9.40 port 39490 ssh2
Sep 02 13:40:13 rmg-vpn-01 sshd[22238]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 13:40:15 rmg-vpn-01 sshd[22238]: Failed password for nagios from 10.20.9.40 port 61888 ssh2
Sep 02 13:45:15 rmg-vpn-01 sshd[22240]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 13:45:17 rmg-vpn-01 sshd[22240]: Failed password for nagios from 10.20.9.40 port 63587 ssh2
Sep 02 13:50:22 rmg-vpn-01 sshd[22241]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 13:50:24 rmg-vpn-01 sshd[22241]: Failed password for nagios from 10.20.9.40 port 53208 ssh2
Sep 02 13:55:30 rmg-vpn-01 sshd[22243]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 13:55:32 rmg-vpn-01 sshd[22243]: Failed password for nagios from 10.20.9.40 port 55897 ssh2
Sep 02 13:59:19 rmg-vpn-01 sshd[23163]: Invalid user oracle from 192.0.2.171 port 44095
Sep 02 13:59:20 rmg-vpn-01 sshd[23163]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 13:59:20 rmg-vpn-01 sshd[23163]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=192.0.2.171
Sep 02 13:59:22 rmg-vpn-01 sshd[23163]: Failed password for invalid user oracle from 192.0.2.171 port 44095 ssh2
Sep 02 13:59:23 rmg-vpn-01 sshd[23163]: Connection closed by invalid user oracle 192.0.2.171 port 44095 [preauth]
Sep 02 14:00:12 rmg-vpn-01 sshd[22252]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 14:00:14 rmg-vpn-01 sshd[22252]: Failed password for nagios from 10.20.9.40 port 45213 ssh2
Sep 02 14:05:09 rmg-vpn-01 sshd[22260]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 14:05:11 rmg-vpn-01 sshd[22260]: Failed password for nagios from 10.20.9.40 port 33317 ssh2
Sep 02 14:10:17 rmg-vpn-01 sshd[22263]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 14:10:19 rmg-vpn-01 sshd[22263]: Failed password for nagios from 10.20.9.40 port 31808 ssh2
Sep 02 14:15:10 rmg-vpn-01 sshd[22272]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 14:15:12 rmg-vpn-01 sshd[22272]: Failed password for nagios from 10.20.9.40 port 57635 ssh2
Sep 02 14:17:01 rmg-vpn-01 CRON[28963]: pam_unix(cron:session): session opened for user root(uid=0) by (uid=0)
Sep 02 14:17:01 rmg-vpn-01 CRON[20219]: pam_unix(cron:session): session closed for user root
Sep 02 14:18:54 rmg-vpn-01 sshd[23192]: Invalid user support from 203.0.113.140 port 56227
Sep 02 14:18:55 rmg-vpn-01 sshd[23192]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 14:18:55 rmg-vpn-01 sshd[23192]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.140
Sep 02 14:18:57 rmg-vpn-01 sshd[23192]: Failed password for invalid user support from 203.0.113.140 port 56227 ssh2
Sep 02 14:18:58 rmg-vpn-01 sshd[23192]: Connection closed by invalid user support 203.0.113.140 port 56227 [preauth]
Sep 02 14:20:25 rmg-vpn-01 sshd[22274]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 14:20:27 rmg-vpn-01 sshd[22274]: Failed password for nagios from 10.20.9.40 port 56145 ssh2
Sep 02 14:25:23 rmg-vpn-01 sshd[22280]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 14:25:25 rmg-vpn-01 sshd[22280]: Failed password for nagios from 10.20.9.40 port 58231 ssh2
Sep 02 14:28:53 rmg-vpn-01 sshd[23178]: Invalid user webmaster from 192.0.2.9 port 41187
Sep 02 14:28:54 rmg-vpn-01 sshd[23178]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 14:28:54 rmg-vpn-01 sshd[23178]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=192.0.2.9
Sep 02 14:28:56 rmg-vpn-01 sshd[23178]: Failed password for invalid user webmaster from 192.0.2.9 port 41187 ssh2
Sep 02 14:28:57 rmg-vpn-01 sshd[23178]: Connection closed by invalid user webmaster 192.0.2.9 port 41187 [preauth]
Sep 02 14:30:05 rmg-vpn-01 sshd[22286]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 14:30:07 rmg-vpn-01 sshd[22286]: Failed password for nagios from 10.20.9.40 port 36286 ssh2
Sep 02 14:31:48 rmg-vpn-01 sshd[23186]: Invalid user support from 192.0.2.44 port 58175
Sep 02 14:31:49 rmg-vpn-01 sshd[23186]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 14:31:49 rmg-vpn-01 sshd[23186]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=192.0.2.44
Sep 02 14:31:51 rmg-vpn-01 sshd[23186]: Failed password for invalid user support from 192.0.2.44 port 58175 ssh2
Sep 02 14:31:52 rmg-vpn-01 sshd[23186]: Connection closed by invalid user support 192.0.2.44 port 58175 [preauth]
Sep 02 14:35:01 rmg-vpn-01 sshd[22289]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 14:35:03 rmg-vpn-01 sshd[22289]: Failed password for nagios from 10.20.9.40 port 51229 ssh2
Sep 02 14:36:21 rmg-vpn-01 sshd[23189]: Invalid user support from 203.0.113.201 port 44523
Sep 02 14:36:22 rmg-vpn-01 sshd[23189]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 14:36:22 rmg-vpn-01 sshd[23189]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.201
Sep 02 14:36:24 rmg-vpn-01 sshd[23189]: Failed password for invalid user support from 203.0.113.201 port 44523 ssh2
Sep 02 14:36:25 rmg-vpn-01 sshd[23189]: Connection closed by invalid user support 203.0.113.201 port 44523 [preauth]
Sep 02 14:40:26 rmg-vpn-01 sshd[22293]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 14:40:28 rmg-vpn-01 sshd[22293]: Failed password for nagios from 10.20.9.40 port 31936 ssh2
Sep 02 14:45:20 rmg-vpn-01 sshd[22299]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 14:45:22 rmg-vpn-01 sshd[22299]: Failed password for nagios from 10.20.9.40 port 47066 ssh2
Sep 02 14:50:10 rmg-vpn-01 sshd[22307]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 14:50:12 rmg-vpn-01 sshd[22307]: Failed password for nagios from 10.20.9.40 port 43385 ssh2
Sep 02 14:55:20 rmg-vpn-01 sshd[22308]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 14:55:22 rmg-vpn-01 sshd[22308]: Failed password for nagios from 10.20.9.40 port 46533 ssh2
Sep 02 14:56:47 rmg-vpn-01 sshd[23194]: Invalid user postgres from 198.51.100.23 port 37056
Sep 02 14:56:48 rmg-vpn-01 sshd[23194]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 14:56:48 rmg-vpn-01 sshd[23194]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.23
Sep 02 14:56:50 rmg-vpn-01 sshd[23194]: Failed password for invalid user postgres from 198.51.100.23 port 37056 ssh2
Sep 02 14:56:51 rmg-vpn-01 sshd[23194]: Connection closed by invalid user postgres 198.51.100.23 port 37056 [preauth]
Sep 02 15:00:19 rmg-vpn-01 sshd[22313]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 15:00:21 rmg-vpn-01 sshd[22313]: Failed password for nagios from 10.20.9.40 port 62112 ssh2
Sep 02 15:05:08 rmg-vpn-01 sshd[22319]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 15:05:10 rmg-vpn-01 sshd[22319]: Failed password for nagios from 10.20.9.40 port 54330 ssh2
Sep 02 15:10:06 rmg-vpn-01 sshd[22322]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 15:10:08 rmg-vpn-01 sshd[22322]: Failed password for nagios from 10.20.9.40 port 46216 ssh2
Sep 02 15:15:19 rmg-vpn-01 sshd[22328]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 15:15:21 rmg-vpn-01 sshd[22328]: Failed password for nagios from 10.20.9.40 port 33911 ssh2
Sep 02 15:17:01 rmg-vpn-01 CRON[27907]: pam_unix(cron:session): session opened for user root(uid=0) by (uid=0)
Sep 02 15:17:01 rmg-vpn-01 CRON[23031]: pam_unix(cron:session): session closed for user root
Sep 02 15:20:28 rmg-vpn-01 sshd[22331]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 15:20:30 rmg-vpn-01 sshd[22331]: Failed password for nagios from 10.20.9.40 port 53015 ssh2
Sep 02 15:25:14 rmg-vpn-01 sshd[22340]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 15:25:16 rmg-vpn-01 sshd[22340]: Failed password for nagios from 10.20.9.40 port 41453 ssh2
Sep 02 15:30:24 rmg-vpn-01 sshd[22346]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 15:30:26 rmg-vpn-01 sshd[22346]: Failed password for nagios from 10.20.9.40 port 49400 ssh2
Sep 02 15:35:20 rmg-vpn-01 sshd[23205]: Invalid user pi from 203.0.113.140 port 50915
Sep 02 15:35:21 rmg-vpn-01 sshd[23205]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 15:35:21 rmg-vpn-01 sshd[23205]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.140
Sep 02 15:35:23 rmg-vpn-01 sshd[23205]: Failed password for invalid user pi from 203.0.113.140 port 50915 ssh2
Sep 02 15:35:24 rmg-vpn-01 sshd[23205]: Connection closed by invalid user pi 203.0.113.140 port 50915 [preauth]
Sep 02 15:35:27 rmg-vpn-01 sshd[22352]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 15:35:29 rmg-vpn-01 sshd[22352]: Failed password for nagios from 10.20.9.40 port 42661 ssh2
Sep 02 15:37:59 rmg-vpn-01 sshd[23211]: Invalid user guest from 203.0.113.201 port 48145
Sep 02 15:38:00 rmg-vpn-01 sshd[23211]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 15:38:00 rmg-vpn-01 sshd[23211]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.201
Sep 02 15:38:02 rmg-vpn-01 sshd[23211]: Failed password for invalid user guest from 203.0.113.201 port 48145 ssh2
Sep 02 15:38:03 rmg-vpn-01 sshd[23211]: Connection closed by invalid user guest 203.0.113.201 port 48145 [preauth]
Sep 02 15:40:23 rmg-vpn-01 sshd[22361]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 15:40:25 rmg-vpn-01 sshd[22361]: Failed password for nagios from 10.20.9.40 port 59119 ssh2
Sep 02 15:41:34 rmg-vpn-01 sshd[23206]: Invalid user support from 198.51.100.23 port 57815
Sep 02 15:41:35 rmg-vpn-01 sshd[23206]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 15:41:35 rmg-vpn-01 sshd[23206]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.23
Sep 02 15:41:37 rmg-vpn-01 sshd[23206]: Failed password for invalid user support from 198.51.100.23 port 57815 ssh2
Sep 02 15:41:38 rmg-vpn-01 sshd[23206]: Connection closed by invalid user support 198.51.100.23 port 57815 [preauth]
Sep 02 15:42:13 rmg-vpn-01 sshd[23196]: Invalid user ftpuser from 198.51.100.202 port 37932
Sep 02 15:42:14 rmg-vpn-01 sshd[23196]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 15:42:14 rmg-vpn-01 sshd[23196]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.202
Sep 02 15:42:16 rmg-vpn-01 sshd[23196]: Failed password for invalid user ftpuser from 198.51.100.202 port 37932 ssh2
Sep 02 15:42:17 rmg-vpn-01 sshd[23196]: Connection closed by invalid user ftpuser 198.51.100.202 port 37932 [preauth]
Sep 02 15:45:21 rmg-vpn-01 sshd[22363]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 15:45:23 rmg-vpn-01 sshd[22363]: Failed password for nagios from 10.20.9.40 port 48340 ssh2
Sep 02 15:46:27 rmg-vpn-01 sshd[23217]: Invalid user user from 203.0.113.140 port 60993
Sep 02 15:46:28 rmg-vpn-01 sshd[23217]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 15:46:28 rmg-vpn-01 sshd[23217]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.140
Sep 02 15:46:30 rmg-vpn-01 sshd[23217]: Failed password for invalid user user from 203.0.113.140 port 60993 ssh2
Sep 02 15:46:31 rmg-vpn-01 sshd[23217]: Connection closed by invalid user user 203.0.113.140 port 60993 [preauth]
Sep 02 15:50:16 rmg-vpn-01 sshd[22368]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 15:50:18 rmg-vpn-01 sshd[22368]: Failed password for nagios from 10.20.9.40 port 56555 ssh2
Sep 02 15:55:23 rmg-vpn-01 sshd[22371]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 15:55:25 rmg-vpn-01 sshd[22371]: Failed password for nagios from 10.20.9.40 port 37620 ssh2
Sep 02 16:00:11 rmg-vpn-01 sshd[22375]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 16:00:13 rmg-vpn-01 sshd[22375]: Failed password for nagios from 10.20.9.40 port 61576 ssh2
Sep 02 16:05:07 rmg-vpn-01 sshd[22381]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 16:05:09 rmg-vpn-01 sshd[22381]: Failed password for nagios from 10.20.9.40 port 32271 ssh2
Sep 02 16:10:25 rmg-vpn-01 sshd[22389]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 16:10:27 rmg-vpn-01 sshd[22389]: Failed password for nagios from 10.20.9.40 port 42129 ssh2
Sep 02 16:14:15 rmg-vpn-01 sshd[23228]: Invalid user git from 192.0.2.44 port 64291
Sep 02 16:14:16 rmg-vpn-01 sshd[23228]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 16:14:16 rmg-vpn-01 sshd[23228]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=192.0.2.44
Sep 02 16:14:18 rmg-vpn-01 sshd[23228]: Failed password for invalid user git from 192.0.2.44 port 64291 ssh2
Sep 02 16:14:19 rmg-vpn-01 sshd[23228]: Connection closed by invalid user git 192.0.2.44 port 64291 [preauth]
Sep 02 16:15:03 rmg-vpn-01 sshd[22391]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 16:15:05 rmg-vpn-01 sshd[22391]: Failed password for nagios from 10.20.9.40 port 52210 ssh2
Sep 02 16:17:01 rmg-vpn-01 CRON[18150]: pam_unix(cron:session): session opened for user root(uid=0) by (uid=0)
Sep 02 16:17:01 rmg-vpn-01 CRON[11376]: pam_unix(cron:session): session closed for user root
Sep 02 16:20:30 rmg-vpn-01 sshd[22392]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 16:20:32 rmg-vpn-01 sshd[22392]: Failed password for nagios from 10.20.9.40 port 36869 ssh2
Sep 02 16:25:30 rmg-vpn-01 sshd[22398]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 16:25:32 rmg-vpn-01 sshd[22398]: Failed password for nagios from 10.20.9.40 port 35444 ssh2
Sep 02 16:27:37 rmg-vpn-01 sshd[23223]: Invalid user guest from 198.51.100.202 port 61142
Sep 02 16:27:38 rmg-vpn-01 sshd[23223]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 16:27:38 rmg-vpn-01 sshd[23223]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.202
Sep 02 16:27:40 rmg-vpn-01 sshd[23223]: Failed password for invalid user guest from 198.51.100.202 port 61142 ssh2
Sep 02 16:27:41 rmg-vpn-01 sshd[23223]: Connection closed by invalid user guest 198.51.100.202 port 61142 [preauth]
Sep 02 16:28:11 rmg-vpn-01 sshd[23236]: Invalid user guest from 192.0.2.44 port 35219
Sep 02 16:28:12 rmg-vpn-01 sshd[23236]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 16:28:12 rmg-vpn-01 sshd[23236]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=192.0.2.44
Sep 02 16:28:14 rmg-vpn-01 sshd[23236]: Failed password for invalid user guest from 192.0.2.44 port 35219 ssh2
Sep 02 16:28:15 rmg-vpn-01 sshd[23236]: Connection closed by invalid user guest 192.0.2.44 port 35219 [preauth]
Sep 02 16:30:21 rmg-vpn-01 sshd[22399]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 16:30:23 rmg-vpn-01 sshd[22399]: Failed password for nagios from 10.20.9.40 port 46002 ssh2
Sep 02 16:30:29 rmg-vpn-01 sshd[23245]: Invalid user guest from 198.51.100.23 port 34001
Sep 02 16:30:30 rmg-vpn-01 sshd[23245]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 16:30:30 rmg-vpn-01 sshd[23245]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.23
Sep 02 16:30:32 rmg-vpn-01 sshd[23245]: Failed password for invalid user guest from 198.51.100.23 port 34001 ssh2
Sep 02 16:30:33 rmg-vpn-01 sshd[23245]: Connection closed by invalid user guest 198.51.100.23 port 34001 [preauth]
Sep 02 16:35:09 rmg-vpn-01 sshd[22400]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 16:35:11 rmg-vpn-01 sshd[22400]: Failed password for nagios from 10.20.9.40 port 56079 ssh2
Sep 02 16:36:28 rmg-vpn-01 sshd[23229]: Invalid user postgres from 203.0.113.140 port 49628
Sep 02 16:36:29 rmg-vpn-01 sshd[23229]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 16:36:29 rmg-vpn-01 sshd[23229]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.140
Sep 02 16:36:31 rmg-vpn-01 sshd[23229]: Failed password for invalid user postgres from 203.0.113.140 port 49628 ssh2
Sep 02 16:36:32 rmg-vpn-01 sshd[23229]: Connection closed by invalid user postgres 203.0.113.140 port 49628 [preauth]
Sep 02 16:38:02 rmg-vpn-01 sshd[23252]: Invalid user mysql from 192.0.2.44 port 50139
Sep 02 16:38:03 rmg-vpn-01 sshd[23252]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 16:38:03 rmg-vpn-01 sshd[23252]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=192.0.2.44
Sep 02 16:38:05 rmg-vpn-01 sshd[23252]: Failed password for invalid user mysql from 192.0.2.44 port 50139 ssh2
Sep 02 16:38:06 rmg-vpn-01 sshd[23252]: Connection closed by invalid user mysql 192.0.2.44 port 50139 [preauth]
Sep 02 16:38:42 rmg-vpn-01 sshd[23258]: Invalid user git from 203.0.113.201 port 54236
Sep 02 16:38:43 rmg-vpn-01 sshd[23258]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 16:38:43 rmg-vpn-01 sshd[23258]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.201
Sep 02 16:38:45 rmg-vpn-01 sshd[23258]: Failed password for invalid user git from 203.0.113.201 port 54236 ssh2
Sep 02 16:38:46 rmg-vpn-01 sshd[23258]: Connection closed by invalid user git 203.0.113.201 port 54236 [preauth]
Sep 02 16:40:28 rmg-vpn-01 sshd[22408]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 16:40:30 rmg-vpn-01 sshd[22408]: Failed password for nagios from 10.20.9.40 port 59086 ssh2
Sep 02 16:40:37 rmg-vpn-01 sshd[23400]: pam_unix(sshd:session): session closed for user jmartel
Sep 02 16:45:03 rmg-vpn-01 sshd[22411]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 16:45:05 rmg-vpn-01 sshd[22411]: Failed password for nagios from 10.20.9.40 port 60552 ssh2
Sep 02 16:47:54 rmg-vpn-01 sshd[23401]: pam_unix(sshd:session): session closed for user dokafor
Sep 02 16:50:13 rmg-vpn-01 sshd[22419]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 16:50:15 rmg-vpn-01 sshd[22419]: Failed password for nagios from 10.20.9.40 port 56570 ssh2
Sep 02 16:54:07 rmg-vpn-01 sshd[23404]: pam_unix(sshd:session): session closed for user rchen
Sep 02 16:55:16 rmg-vpn-01 sshd[22428]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 16:55:18 rmg-vpn-01 sshd[22428]: Failed password for nagios from 10.20.9.40 port 63268 ssh2
Sep 02 17:00:04 rmg-vpn-01 sshd[22434]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 17:00:06 rmg-vpn-01 sshd[22434]: Failed password for nagios from 10.20.9.40 port 35094 ssh2
Sep 02 17:05:16 rmg-vpn-01 sshd[22439]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 17:05:18 rmg-vpn-01 sshd[22439]: Failed password for nagios from 10.20.9.40 port 41936 ssh2
Sep 02 17:10:08 rmg-vpn-01 sshd[22445]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 17:10:10 rmg-vpn-01 sshd[22445]: Failed password for nagios from 10.20.9.40 port 48326 ssh2
Sep 02 17:15:30 rmg-vpn-01 sshd[22451]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 17:15:32 rmg-vpn-01 sshd[22451]: Failed password for nagios from 10.20.9.40 port 43345 ssh2
Sep 02 17:17:01 rmg-vpn-01 CRON[22662]: pam_unix(cron:session): session opened for user root(uid=0) by (uid=0)
Sep 02 17:17:01 rmg-vpn-01 CRON[17764]: pam_unix(cron:session): session closed for user root
Sep 02 17:20:04 rmg-vpn-01 sshd[22453]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 17:20:06 rmg-vpn-01 sshd[22453]: Failed password for nagios from 10.20.9.40 port 64187 ssh2
Sep 02 17:21:05 rmg-vpn-01 sshd[23259]: Invalid user support from 192.0.2.44 port 40986
Sep 02 17:21:06 rmg-vpn-01 sshd[23259]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 17:21:06 rmg-vpn-01 sshd[23259]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=192.0.2.44
Sep 02 17:21:08 rmg-vpn-01 sshd[23259]: Failed password for invalid user support from 192.0.2.44 port 40986 ssh2
Sep 02 17:21:09 rmg-vpn-01 sshd[23259]: Connection closed by invalid user support 192.0.2.44 port 40986 [preauth]
Sep 02 17:25:20 rmg-vpn-01 sshd[22461]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 17:25:22 rmg-vpn-01 sshd[22461]: Failed password for nagios from 10.20.9.40 port 64288 ssh2
Sep 02 17:30:19 rmg-vpn-01 sshd[22466]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 17:30:21 rmg-vpn-01 sshd[22466]: Failed password for nagios from 10.20.9.40 port 39244 ssh2
Sep 02 17:30:32 rmg-vpn-01 sshd[23260]: Invalid user webmaster from 192.0.2.9 port 59813
Sep 02 17:30:33 rmg-vpn-01 sshd[23260]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 17:30:33 rmg-vpn-01 sshd[23260]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=192.0.2.9
Sep 02 17:30:35 rmg-vpn-01 sshd[23260]: Failed password for invalid user webmaster from 192.0.2.9 port 59813 ssh2
Sep 02 17:30:36 rmg-vpn-01 sshd[23260]: Connection closed by invalid user webmaster 192.0.2.9 port 59813 [preauth]
Sep 02 17:35:25 rmg-vpn-01 sshd[22470]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 17:35:27 rmg-vpn-01 sshd[22470]: Failed password for nagios from 10.20.9.40 port 34359 ssh2
Sep 02 17:40:25 rmg-vpn-01 sshd[22477]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 17:40:27 rmg-vpn-01 sshd[22477]: Failed password for nagios from 10.20.9.40 port 33187 ssh2
Sep 02 17:45:10 rmg-vpn-01 sshd[22486]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 17:45:12 rmg-vpn-01 sshd[22486]: Failed password for nagios from 10.20.9.40 port 54169 ssh2
Sep 02 17:50:13 rmg-vpn-01 sshd[22487]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 17:50:15 rmg-vpn-01 sshd[22487]: Failed password for nagios from 10.20.9.40 port 61495 ssh2
Sep 02 17:55:23 rmg-vpn-01 sshd[22496]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 17:55:25 rmg-vpn-01 sshd[22496]: Failed password for nagios from 10.20.9.40 port 55376 ssh2
Sep 02 18:00:11 rmg-vpn-01 sshd[22497]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 18:00:13 rmg-vpn-01 sshd[22497]: Failed password for nagios from 10.20.9.40 port 38249 ssh2
Sep 02 18:05:11 rmg-vpn-01 sshd[22501]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 18:05:13 rmg-vpn-01 sshd[22501]: Failed password for nagios from 10.20.9.40 port 30137 ssh2
Sep 02 18:06:46 rmg-vpn-01 sshd[23267]: Invalid user webmaster from 203.0.113.201 port 54108
Sep 02 18:06:47 rmg-vpn-01 sshd[23267]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 18:06:47 rmg-vpn-01 sshd[23267]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.201
Sep 02 18:06:49 rmg-vpn-01 sshd[23267]: Failed password for invalid user webmaster from 203.0.113.201 port 54108 ssh2
Sep 02 18:06:50 rmg-vpn-01 sshd[23267]: Connection closed by invalid user webmaster 203.0.113.201 port 54108 [preauth]
Sep 02 18:10:19 rmg-vpn-01 sshd[22505]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 18:10:21 rmg-vpn-01 sshd[22505]: Failed password for nagios from 10.20.9.40 port 62056 ssh2
Sep 02 18:15:20 rmg-vpn-01 sshd[22510]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 18:15:22 rmg-vpn-01 sshd[22510]: Failed password for nagios from 10.20.9.40 port 49328 ssh2
Sep 02 18:17:01 rmg-vpn-01 CRON[9593]: pam_unix(cron:session): session opened for user root(uid=0) by (uid=0)
Sep 02 18:17:01 rmg-vpn-01 CRON[29159]: pam_unix(cron:session): session closed for user root
Sep 02 18:18:52 rmg-vpn-01 sshd[23262]: Invalid user oracle from 203.0.113.12 port 60323
Sep 02 18:18:53 rmg-vpn-01 sshd[23262]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 18:18:53 rmg-vpn-01 sshd[23262]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12
Sep 02 18:18:55 rmg-vpn-01 sshd[23262]: Failed password for invalid user oracle from 203.0.113.12 port 60323 ssh2
Sep 02 18:18:56 rmg-vpn-01 sshd[23262]: Connection closed by invalid user oracle 203.0.113.12 port 60323 [preauth]
Sep 02 18:20:12 rmg-vpn-01 sshd[22519]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 18:20:14 rmg-vpn-01 sshd[22519]: Failed password for nagios from 10.20.9.40 port 48765 ssh2
Sep 02 18:25:30 rmg-vpn-01 sshd[22521]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 18:25:32 rmg-vpn-01 sshd[22521]: Failed password for nagios from 10.20.9.40 port 47862 ssh2
Sep 02 18:30:02 rmg-vpn-01 sshd[22528]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 18:30:04 rmg-vpn-01 sshd[22528]: Failed password for nagios from 10.20.9.40 port 64736 ssh2
Sep 02 18:33:21 rmg-vpn-01 sshd[23275]: Invalid user git from 192.0.2.44 port 49508
Sep 02 18:33:22 rmg-vpn-01 sshd[23275]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 18:33:22 rmg-vpn-01 sshd[23275]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=192.0.2.44
Sep 02 18:33:24 rmg-vpn-01 sshd[23275]: Failed password for invalid user git from 192.0.2.44 port 49508 ssh2
Sep 02 18:33:25 rmg-vpn-01 sshd[23275]: Connection closed by invalid user git 192.0.2.44 port 49508 [preauth]
Sep 02 18:35:03 rmg-vpn-01 sshd[22530]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 18:35:05 rmg-vpn-01 sshd[22530]: Failed password for nagios from 10.20.9.40 port 40391 ssh2
Sep 02 18:40:01 rmg-vpn-01 sshd[22532]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 18:40:03 rmg-vpn-01 sshd[22532]: Failed password for nagios from 10.20.9.40 port 42446 ssh2
Sep 02 18:42:53 rmg-vpn-01 sshd[23280]: Invalid user postgres from 198.51.100.202 port 50551
Sep 02 18:42:54 rmg-vpn-01 sshd[23280]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 18:42:54 rmg-vpn-01 sshd[23280]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.202
Sep 02 18:42:56 rmg-vpn-01 sshd[23280]: Failed password for invalid user postgres from 198.51.100.202 port 50551 ssh2
Sep 02 18:42:57 rmg-vpn-01 sshd[23280]: Connection closed by invalid user postgres 198.51.100.202 port 50551 [preauth]
Sep 02 18:45:30 rmg-vpn-01 sshd[22536]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 18:45:32 rmg-vpn-01 sshd[22536]: Failed password for nagios from 10.20.9.40 port 30417 ssh2
Sep 02 18:48:17 rmg-vpn-01 sshd[23272]: Invalid user ubuntu from 192.0.2.44 port 57689
Sep 02 18:48:18 rmg-vpn-01 sshd[23272]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 18:48:18 rmg-vpn-01 sshd[23272]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=192.0.2.44
Sep 02 18:48:20 rmg-vpn-01 sshd[23272]: Failed password for invalid user ubuntu from 192.0.2.44 port 57689 ssh2
Sep 02 18:48:21 rmg-vpn-01 sshd[23272]: Connection closed by invalid user ubuntu 192.0.2.44 port 57689 [preauth]
Sep 02 18:49:53 rmg-vpn-01 sshd[23286]: Invalid user mysql from 198.51.100.202 port 62197
Sep 02 18:49:54 rmg-vpn-01 sshd[23286]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 18:49:54 rmg-vpn-01 sshd[23286]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.202
Sep 02 18:49:56 rmg-vpn-01 sshd[23286]: Failed password for invalid user mysql from 198.51.100.202 port 62197 ssh2
Sep 02 18:49:57 rmg-vpn-01 sshd[23286]: Connection closed by invalid user mysql 198.51.100.202 port 62197 [preauth]
Sep 02 18:50:12 rmg-vpn-01 sshd[22537]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 18:50:14 rmg-vpn-01 sshd[22537]: Failed password for nagios from 10.20.9.40 port 41660 ssh2
Sep 02 18:55:11 rmg-vpn-01 sshd[22544]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 18:55:13 rmg-vpn-01 sshd[22544]: Failed password for nagios from 10.20.9.40 port 64535 ssh2
Sep 02 19:00:26 rmg-vpn-01 sshd[22546]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 19:00:28 rmg-vpn-01 sshd[22546]: Failed password for nagios from 10.20.9.40 port 63882 ssh2
Sep 02 19:05:16 rmg-vpn-01 sshd[22555]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 19:05:18 rmg-vpn-01 sshd[22555]: Failed password for nagios from 10.20.9.40 port 35836 ssh2
Sep 02 19:09:39 rmg-vpn-01 sshd[23302]: Invalid user oracle from 198.51.100.202 port 60901
Sep 02 19:09:40 rmg-vpn-01 sshd[23302]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 19:09:40 rmg-vpn-01 sshd[23302]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.202
Sep 02 19:09:42 rmg-vpn-01 sshd[23302]: Failed password for invalid user oracle from 198.51.100.202 port 60901 ssh2
Sep 02 19:09:43 rmg-vpn-01 sshd[23302]: Connection closed by invalid user oracle 198.51.100.202 port 60901 [preauth]
Sep 02 19:10:16 rmg-vpn-01 sshd[22564]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 19:10:18 rmg-vpn-01 sshd[22564]: Failed password for nagios from 10.20.9.40 port 49974 ssh2
Sep 02 19:15:29 rmg-vpn-01 sshd[22572]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 19:15:31 rmg-vpn-01 sshd[22572]: Failed password for nagios from 10.20.9.40 port 37993 ssh2
Sep 02 19:17:01 rmg-vpn-01 CRON[25966]: pam_unix(cron:session): session opened for user root(uid=0) by (uid=0)
Sep 02 19:17:01 rmg-vpn-01 CRON[29958]: pam_unix(cron:session): session closed for user root
Sep 02 19:20:15 rmg-vpn-01 sshd[22576]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 19:20:17 rmg-vpn-01 sshd[22576]: Failed password for nagios from 10.20.9.40 port 59757 ssh2
Sep 02 19:25:25 rmg-vpn-01 sshd[22580]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 19:25:27 rmg-vpn-01 sshd[22580]: Failed password for nagios from 10.20.9.40 port 43861 ssh2
Sep 02 19:30:21 rmg-vpn-01 sshd[22586]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 19:30:23 rmg-vpn-01 sshd[22586]: Failed password for nagios from 10.20.9.40 port 49612 ssh2
Sep 02 19:35:02 rmg-vpn-01 sshd[22595]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 19:35:04 rmg-vpn-01 sshd[22595]: Failed password for nagios from 10.20.9.40 port 34983 ssh2
Sep 02 19:40:26 rmg-vpn-01 sshd[22596]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 19:40:28 rmg-vpn-01 sshd[22596]: Failed password for nagios from 10.20.9.40 port 52777 ssh2
Sep 02 19:40:53 rmg-vpn-01 sshd[23293]: Invalid user postgres from 203.0.113.201 port 50337
Sep 02 19:40:54 rmg-vpn-01 sshd[23293]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 19:40:54 rmg-vpn-01 sshd[23293]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.201
Sep 02 19:40:56 rmg-vpn-01 sshd[23293]: Failed password for invalid user postgres from 203.0.113.201 port 50337 ssh2
Sep 02 19:40:57 rmg-vpn-01 sshd[23293]: Connection closed by invalid user postgres 203.0.113.201 port 50337 [preauth]
Sep 02 19:41:52 rmg-vpn-01 sshd[23312]: Invalid user guest from 203.0.113.12 port 36282
Sep 02 19:41:53 rmg-vpn-01 sshd[23312]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 19:41:53 rmg-vpn-01 sshd[23312]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12
Sep 02 19:41:55 rmg-vpn-01 sshd[23312]: Failed password for invalid user guest from 203.0.113.12 port 36282 ssh2
Sep 02 19:41:56 rmg-vpn-01 sshd[23312]: Connection closed by invalid user guest 203.0.113.12 port 36282 [preauth]
Sep 02 19:43:17 rmg-vpn-01 sshd[23303]: Invalid user support from 192.0.2.9 port 63455
Sep 02 19:43:18 rmg-vpn-01 sshd[23303]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 19:43:18 rmg-vpn-01 sshd[23303]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=192.0.2.9
Sep 02 19:43:20 rmg-vpn-01 sshd[23303]: Failed password for invalid user support from 192.0.2.9 port 63455 ssh2
Sep 02 19:43:21 rmg-vpn-01 sshd[23303]: Connection closed by invalid user support 192.0.2.9 port 63455 [preauth]
Sep 02 19:45:02 rmg-vpn-01 sshd[22604]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 19:45:04 rmg-vpn-01 sshd[22604]: Failed password for nagios from 10.20.9.40 port 38101 ssh2
Sep 02 19:49:09 rmg-vpn-01 sshd[23311]: Invalid user ftpuser from 192.0.2.171 port 59513
Sep 02 19:49:10 rmg-vpn-01 sshd[23311]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 19:49:10 rmg-vpn-01 sshd[23311]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=192.0.2.171
Sep 02 19:49:12 rmg-vpn-01 sshd[23311]: Failed password for invalid user ftpuser from 192.0.2.171 port 59513 ssh2
Sep 02 19:49:13 rmg-vpn-01 sshd[23311]: Connection closed by invalid user ftpuser 192.0.2.171 port 59513 [preauth]
Sep 02 19:50:16 rmg-vpn-01 sshd[22612]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 19:50:18 rmg-vpn-01 sshd[22612]: Failed password for nagios from 10.20.9.40 port 43945 ssh2
Sep 02 19:52:32 rmg-vpn-01 sshd[23300]: Invalid user mysql from 203.0.113.12 port 43185
Sep 02 19:52:33 rmg-vpn-01 sshd[23300]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 19:52:33 rmg-vpn-01 sshd[23300]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12
Sep 02 19:52:35 rmg-vpn-01 sshd[23300]: Failed password for invalid user mysql from 203.0.113.12 port 43185 ssh2
Sep 02 19:52:36 rmg-vpn-01 sshd[23300]: Connection closed by invalid user mysql 203.0.113.12 port 43185 [preauth]
Sep 02 19:55:20 rmg-vpn-01 sshd[22614]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 19:55:22 rmg-vpn-01 sshd[22614]: Failed password for nagios from 10.20.9.40 port 36146 ssh2
Sep 02 19:58:32 rmg-vpn-01 sshd[23298]: Invalid user jenkins from 203.0.113.140 port 39258
Sep 02 19:58:33 rmg-vpn-01 sshd[23298]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 19:58:33 rmg-vpn-01 sshd[23298]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.140
Sep 02 19:58:35 rmg-vpn-01 sshd[23298]: Failed password for invalid user jenkins from 203.0.113.140 port 39258 ssh2
Sep 02 19:58:36 rmg-vpn-01 sshd[23298]: Connection closed by invalid user jenkins 203.0.113.140 port 39258 [preauth]
Sep 02 20:00:15 rmg-vpn-01 sshd[22617]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 20:00:17 rmg-vpn-01 sshd[22617]: Failed password for nagios from 10.20.9.40 port 38007 ssh2
Sep 02 20:05:16 rmg-vpn-01 sshd[22619]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 20:05:18 rmg-vpn-01 sshd[22619]: Failed password for nagios from 10.20.9.40 port 63639 ssh2
Sep 02 20:10:23 rmg-vpn-01 sshd[22620]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 20:10:25 rmg-vpn-01 sshd[22620]: Failed password for nagios from 10.20.9.40 port 53579 ssh2
Sep 02 20:15:27 rmg-vpn-01 sshd[22628]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 20:15:29 rmg-vpn-01 sshd[22628]: Failed password for nagios from 10.20.9.40 port 55976 ssh2
Sep 02 20:16:24 rmg-vpn-01 sshd[23319]: Invalid user jenkins from 203.0.113.140 port 44246
Sep 02 20:16:25 rmg-vpn-01 sshd[23319]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 20:16:25 rmg-vpn-01 sshd[23319]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.140
Sep 02 20:16:27 rmg-vpn-01 sshd[23319]: Failed password for invalid user jenkins from 203.0.113.140 port 44246 ssh2
Sep 02 20:16:28 rmg-vpn-01 sshd[23319]: Connection closed by invalid user jenkins 203.0.113.140 port 44246 [preauth]
Sep 02 20:17:01 rmg-vpn-01 CRON[14451]: pam_unix(cron:session): session opened for user root(uid=0) by (uid=0)
Sep 02 20:17:01 rmg-vpn-01 CRON[18032]: pam_unix(cron:session): session closed for user root
Sep 02 20:20:29 rmg-vpn-01 sshd[22630]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 20:20:31 rmg-vpn-01 sshd[22630]: Failed password for nagios from 10.20.9.40 port 54247 ssh2
Sep 02 20:25:30 rmg-vpn-01 sshd[22634]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 20:25:32 rmg-vpn-01 sshd[22634]: Failed password for nagios from 10.20.9.40 port 30739 ssh2
Sep 02 20:30:16 rmg-vpn-01 sshd[22635]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 20:30:18 rmg-vpn-01 sshd[22635]: Failed password for nagios from 10.20.9.40 port 42542 ssh2
Sep 02 20:35:18 rmg-vpn-01 sshd[22643]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 20:35:20 rmg-vpn-01 sshd[22643]: Failed password for nagios from 10.20.9.40 port 63519 ssh2
Sep 02 20:40:27 rmg-vpn-01 sshd[22645]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 20:40:29 rmg-vpn-01 sshd[22645]: Failed password for nagios from 10.20.9.40 port 42345 ssh2
Sep 02 20:43:14 rmg-vpn-01 sshd[23327]: Invalid user pi from 192.0.2.171 port 32893
Sep 02 20:43:15 rmg-vpn-01 sshd[23327]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 20:43:15 rmg-vpn-01 sshd[23327]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=192.0.2.171
Sep 02 20:43:17 rmg-vpn-01 sshd[23327]: Failed password for invalid user pi from 192.0.2.171 port 32893 ssh2
Sep 02 20:43:18 rmg-vpn-01 sshd[23327]: Connection closed by invalid user pi 192.0.2.171 port 32893 [preauth]
Sep 02 20:45:01 rmg-vpn-01 sshd[22649]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 20:45:03 rmg-vpn-01 sshd[22649]: Failed password for nagios from 10.20.9.40 port 45561 ssh2
Sep 02 20:50:16 rmg-vpn-01 sshd[22655]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 20:50:18 rmg-vpn-01 sshd[22655]: Failed password for nagios from 10.20.9.40 port 33381 ssh2
Sep 02 20:50:38 rmg-vpn-01 sshd[23325]: Invalid user ubuntu from 203.0.113.12 port 46386
Sep 02 20:50:39 rmg-vpn-01 sshd[23325]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 20:50:39 rmg-vpn-01 sshd[23325]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12
Sep 02 20:50:41 rmg-vpn-01 sshd[23325]: Failed password for invalid user ubuntu from 203.0.113.12 port 46386 ssh2
Sep 02 20:50:42 rmg-vpn-01 sshd[23325]: Connection closed by invalid user ubuntu 203.0.113.12 port 46386 [preauth]
Sep 02 20:55:24 rmg-vpn-01 sshd[22658]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 20:55:26 rmg-vpn-01 sshd[22658]: Failed password for nagios from 10.20.9.40 port 63312 ssh2
Sep 02 20:58:20 rmg-vpn-01 sshd[23318]: Invalid user support from 198.51.100.23 port 62292
Sep 02 20:58:21 rmg-vpn-01 sshd[23318]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 20:58:21 rmg-vpn-01 sshd[23318]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.23
Sep 02 20:58:23 rmg-vpn-01 sshd[23318]: Failed password for invalid user support from 198.51.100.23 port 62292 ssh2
Sep 02 20:58:24 rmg-vpn-01 sshd[23318]: Connection closed by invalid user support 198.51.100.23 port 62292 [preauth]
Sep 02 21:00:05 rmg-vpn-01 sshd[22665]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 21:00:07 rmg-vpn-01 sshd[22665]: Failed password for nagios from 10.20.9.40 port 60455 ssh2
Sep 02 21:01:41 rmg-vpn-01 sshd[23334]: Invalid user pi from 192.0.2.9 port 53977
Sep 02 21:01:42 rmg-vpn-01 sshd[23334]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 21:01:42 rmg-vpn-01 sshd[23334]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=192.0.2.9
Sep 02 21:01:44 rmg-vpn-01 sshd[23334]: Failed password for invalid user pi from 192.0.2.9 port 53977 ssh2
Sep 02 21:01:45 rmg-vpn-01 sshd[23334]: Connection closed by invalid user pi 192.0.2.9 port 53977 [preauth]
Sep 02 21:05:30 rmg-vpn-01 sshd[22670]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 21:05:32 rmg-vpn-01 sshd[22670]: Failed password for nagios from 10.20.9.40 port 62872 ssh2
Sep 02 21:05:44 rmg-vpn-01 sshd[23340]: Invalid user oracle from 192.0.2.171 port 60543
Sep 02 21:05:45 rmg-vpn-01 sshd[23340]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 21:05:45 rmg-vpn-01 sshd[23340]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=192.0.2.171
Sep 02 21:05:47 rmg-vpn-01 sshd[23340]: Failed password for invalid user oracle from 192.0.2.171 port 60543 ssh2
Sep 02 21:05:48 rmg-vpn-01 sshd[23340]: Connection closed by invalid user oracle 192.0.2.171 port 60543 [preauth]
Sep 02 21:10:18 rmg-vpn-01 sshd[22679]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 21:10:20 rmg-vpn-01 sshd[22679]: Failed password for nagios from 10.20.9.40 port 35984 ssh2
Sep 02 21:13:34 rmg-vpn-01 sshd[23349]: Invalid user support from 203.0.113.140 port 62065
Sep 02 21:13:35 rmg-vpn-01 sshd[23349]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 21:13:35 rmg-vpn-01 sshd[23349]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.140
Sep 02 21:13:37 rmg-vpn-01 sshd[23349]: Failed password for invalid user support from 203.0.113.140 port 62065 ssh2
Sep 02 21:13:38 rmg-vpn-01 sshd[23349]: Connection closed by invalid user support 203.0.113.140 port 62065 [preauth]
Sep 02 21:15:18 rmg-vpn-01 sshd[22685]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 21:15:20 rmg-vpn-01 sshd[22685]: Failed password for nagios from 10.20.9.40 port 54571 ssh2
Sep 02 21:17:01 rmg-vpn-01 CRON[29201]: pam_unix(cron:session): session opened for user root(uid=0) by (uid=0)
Sep 02 21:17:01 rmg-vpn-01 CRON[17132]: pam_unix(cron:session): session closed for user root
Sep 02 21:20:03 rmg-vpn-01 sshd[22689]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 21:20:05 rmg-vpn-01 sshd[22689]: Failed password for nagios from 10.20.9.40 port 42840 ssh2
Sep 02 21:25:15 rmg-vpn-01 sshd[22696]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 21:25:17 rmg-vpn-01 sshd[22696]: Failed password for nagios from 10.20.9.40 port 55495 ssh2
Sep 02 21:27:21 rmg-vpn-01 sshd[23350]: Invalid user oracle from 203.0.113.201 port 54354
Sep 02 21:27:22 rmg-vpn-01 sshd[23350]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 21:27:22 rmg-vpn-01 sshd[23350]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.201
Sep 02 21:27:24 rmg-vpn-01 sshd[23350]: Failed password for invalid user oracle from 203.0.113.201 port 54354 ssh2
Sep 02 21:27:25 rmg-vpn-01 sshd[23350]: Connection closed by invalid user oracle 203.0.113.201 port 54354 [preauth]
Sep 02 21:30:08 rmg-vpn-01 sshd[22704]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 21:30:10 rmg-vpn-01 sshd[22704]: Failed password for nagios from 10.20.9.40 port 45361 ssh2
Sep 02 21:33:55 rmg-vpn-01 sshd[23347]: Invalid user test from 198.51.100.202 port 60939
Sep 02 21:33:56 rmg-vpn-01 sshd[23347]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 21:33:56 rmg-vpn-01 sshd[23347]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.202
Sep 02 21:33:58 rmg-vpn-01 sshd[23347]: Failed password for invalid user test from 198.51.100.202 port 60939 ssh2
Sep 02 21:33:59 rmg-vpn-01 sshd[23347]: Connection closed by invalid user test 198.51.100.202 port 60939 [preauth]
Sep 02 21:35:29 rmg-vpn-01 sshd[22709]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 21:35:31 rmg-vpn-01 sshd[22709]: Failed password for nagios from 10.20.9.40 port 46813 ssh2
Sep 02 21:40:24 rmg-vpn-01 sshd[22714]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 21:40:26 rmg-vpn-01 sshd[22714]: Failed password for nagios from 10.20.9.40 port 52089 ssh2
Sep 02 21:45:07 rmg-vpn-01 sshd[22720]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 21:45:09 rmg-vpn-01 sshd[22720]: Failed password for nagios from 10.20.9.40 port 46442 ssh2
Sep 02 21:45:37 rmg-vpn-01 sshd[23329]: Invalid user ftpuser from 198.51.100.23 port 45699
Sep 02 21:45:38 rmg-vpn-01 sshd[23329]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 21:45:38 rmg-vpn-01 sshd[23329]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.23
Sep 02 21:45:40 rmg-vpn-01 sshd[23329]: Failed password for invalid user ftpuser from 198.51.100.23 port 45699 ssh2
Sep 02 21:45:41 rmg-vpn-01 sshd[23329]: Connection closed by invalid user ftpuser 198.51.100.23 port 45699 [preauth]
Sep 02 21:50:29 rmg-vpn-01 sshd[22723]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 21:50:31 rmg-vpn-01 sshd[22723]: Failed password for nagios from 10.20.9.40 port 36307 ssh2
Sep 02 21:55:25 rmg-vpn-01 sshd[22732]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 21:55:27 rmg-vpn-01 sshd[22732]: Failed password for nagios from 10.20.9.40 port 32234 ssh2
Sep 02 22:00:03 rmg-vpn-01 sshd[22737]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 22:00:05 rmg-vpn-01 sshd[22737]: Failed password for nagios from 10.20.9.40 port 39239 ssh2
Sep 02 22:05:27 rmg-vpn-01 sshd[22738]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 22:05:29 rmg-vpn-01 sshd[22738]: Failed password for nagios from 10.20.9.40 port 59062 ssh2
Sep 02 22:10:12 rmg-vpn-01 sshd[22742]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 22:10:14 rmg-vpn-01 sshd[22742]: Failed password for nagios from 10.20.9.40 port 47329 ssh2
Sep 02 22:12:46 rmg-vpn-01 sshd[23369]: Invalid user jenkins from 198.51.100.202 port 47222
Sep 02 22:12:47 rmg-vpn-01 sshd[23369]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 22:12:47 rmg-vpn-01 sshd[23369]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.202
Sep 02 22:12:49 rmg-vpn-01 sshd[23369]: Failed password for invalid user jenkins from 198.51.100.202 port 47222 ssh2
Sep 02 22:12:50 rmg-vpn-01 sshd[23369]: Connection closed by invalid user jenkins 198.51.100.202 port 47222 [preauth]
Sep 02 22:15:23 rmg-vpn-01 sshd[22751]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 22:15:25 rmg-vpn-01 sshd[22751]: Failed password for nagios from 10.20.9.40 port 36549 ssh2
Sep 02 22:17:01 rmg-vpn-01 CRON[23231]: pam_unix(cron:session): session opened for user root(uid=0) by (uid=0)
Sep 02 22:17:01 rmg-vpn-01 CRON[25764]: pam_unix(cron:session): session closed for user root
Sep 02 22:20:19 rmg-vpn-01 sshd[22758]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 22:20:21 rmg-vpn-01 sshd[22758]: Failed password for nagios from 10.20.9.40 port 49320 ssh2
Sep 02 22:22:10 rmg-vpn-01 sshd[23359]: Invalid user ftpuser from 203.0.113.201 port 34238
Sep 02 22:22:11 rmg-vpn-01 sshd[23359]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 22:22:11 rmg-vpn-01 sshd[23359]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.201
Sep 02 22:22:13 rmg-vpn-01 sshd[23359]: Failed password for invalid user ftpuser from 203.0.113.201 port 34238 ssh2
Sep 02 22:22:14 rmg-vpn-01 sshd[23359]: Connection closed by invalid user ftpuser 203.0.113.201 port 34238 [preauth]
Sep 02 22:22:54 rmg-vpn-01 sshd[23352]: Invalid user deploy from 198.51.100.23 port 34571
Sep 02 22:22:55 rmg-vpn-01 sshd[23352]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 22:22:55 rmg-vpn-01 sshd[23352]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.23
Sep 02 22:22:57 rmg-vpn-01 sshd[23352]: Failed password for invalid user deploy from 198.51.100.23 port 34571 ssh2
Sep 02 22:22:58 rmg-vpn-01 sshd[23352]: Connection closed by invalid user deploy 198.51.100.23 port 34571 [preauth]
Sep 02 22:25:15 rmg-vpn-01 sshd[22760]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 22:25:17 rmg-vpn-01 sshd[22760]: Failed password for nagios from 10.20.9.40 port 40756 ssh2
Sep 02 22:29:32 rmg-vpn-01 sshd[23366]: Invalid user admin from 192.0.2.171 port 62883
Sep 02 22:29:33 rmg-vpn-01 sshd[23366]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 22:29:33 rmg-vpn-01 sshd[23366]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=192.0.2.171
Sep 02 22:29:35 rmg-vpn-01 sshd[23366]: Failed password for invalid user admin from 192.0.2.171 port 62883 ssh2
Sep 02 22:29:36 rmg-vpn-01 sshd[23366]: Connection closed by invalid user admin 192.0.2.171 port 62883 [preauth]
Sep 02 22:30:11 rmg-vpn-01 sshd[22765]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 22:30:13 rmg-vpn-01 sshd[22765]: Failed password for nagios from 10.20.9.40 port 44012 ssh2
Sep 02 22:35:28 rmg-vpn-01 sshd[22770]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 22:35:30 rmg-vpn-01 sshd[22770]: Failed password for nagios from 10.20.9.40 port 31824 ssh2
Sep 02 22:40:09 rmg-vpn-01 sshd[22771]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 22:40:11 rmg-vpn-01 sshd[22771]: Failed password for nagios from 10.20.9.40 port 40584 ssh2
Sep 02 22:45:10 rmg-vpn-01 sshd[22780]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 22:45:12 rmg-vpn-01 sshd[22780]: Failed password for nagios from 10.20.9.40 port 30947 ssh2
Sep 02 22:50:05 rmg-vpn-01 sshd[22789]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 22:50:07 rmg-vpn-01 sshd[22789]: Failed password for nagios from 10.20.9.40 port 62676 ssh2
Sep 02 22:55:14 rmg-vpn-01 sshd[22792]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 22:55:16 rmg-vpn-01 sshd[22792]: Failed password for nagios from 10.20.9.40 port 50565 ssh2
Sep 02 23:00:08 rmg-vpn-01 sshd[22799]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 23:00:10 rmg-vpn-01 sshd[22799]: Failed password for nagios from 10.20.9.40 port 62294 ssh2
Sep 02 23:05:25 rmg-vpn-01 sshd[22800]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 23:05:27 rmg-vpn-01 sshd[22800]: Failed password for nagios from 10.20.9.40 port 49209 ssh2
Sep 02 23:10:07 rmg-vpn-01 sshd[22801]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 23:10:09 rmg-vpn-01 sshd[22801]: Failed password for nagios from 10.20.9.40 port 60480 ssh2
Sep 02 23:13:50 rmg-vpn-01 sshd[23388]: Invalid user ubuntu from 192.0.2.44 port 41631
Sep 02 23:13:51 rmg-vpn-01 sshd[23388]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 23:13:51 rmg-vpn-01 sshd[23388]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=192.0.2.44
Sep 02 23:13:53 rmg-vpn-01 sshd[23388]: Failed password for invalid user ubuntu from 192.0.2.44 port 41631 ssh2
Sep 02 23:13:54 rmg-vpn-01 sshd[23388]: Connection closed by invalid user ubuntu 192.0.2.44 port 41631 [preauth]
Sep 02 23:15:12 rmg-vpn-01 sshd[22802]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 23:15:14 rmg-vpn-01 sshd[22802]: Failed password for nagios from 10.20.9.40 port 31368 ssh2
Sep 02 23:16:23 rmg-vpn-01 sshd[23397]: Invalid user deploy from 203.0.113.140 port 51034
Sep 02 23:16:24 rmg-vpn-01 sshd[23397]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 23:16:24 rmg-vpn-01 sshd[23397]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.140
Sep 02 23:16:26 rmg-vpn-01 sshd[23397]: Failed password for invalid user deploy from 203.0.113.140 port 51034 ssh2
Sep 02 23:16:27 rmg-vpn-01 sshd[23397]: Connection closed by invalid user deploy 203.0.113.140 port 51034 [preauth]
Sep 02 23:17:01 rmg-vpn-01 CRON[14652]: pam_unix(cron:session): session opened for user root(uid=0) by (uid=0)
Sep 02 23:17:01 rmg-vpn-01 CRON[13720]: pam_unix(cron:session): session closed for user root
Sep 02 23:20:24 rmg-vpn-01 sshd[22803]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 23:20:26 rmg-vpn-01 sshd[22803]: Failed password for nagios from 10.20.9.40 port 44807 ssh2
Sep 02 23:24:30 rmg-vpn-01 sshd[23374]: Invalid user webmaster from 203.0.113.12 port 35407
Sep 02 23:24:31 rmg-vpn-01 sshd[23374]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 23:24:31 rmg-vpn-01 sshd[23374]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12
Sep 02 23:24:33 rmg-vpn-01 sshd[23374]: Failed password for invalid user webmaster from 203.0.113.12 port 35407 ssh2
Sep 02 23:24:34 rmg-vpn-01 sshd[23374]: Connection closed by invalid user webmaster 203.0.113.12 port 35407 [preauth]
Sep 02 23:25:29 rmg-vpn-01 sshd[22805]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 23:25:31 rmg-vpn-01 sshd[22805]: Failed password for nagios from 10.20.9.40 port 39085 ssh2
Sep 02 23:26:15 rmg-vpn-01 sshd[23383]: Invalid user oracle from 198.51.100.202 port 47514
Sep 02 23:26:16 rmg-vpn-01 sshd[23383]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 23:26:16 rmg-vpn-01 sshd[23383]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.202
Sep 02 23:26:18 rmg-vpn-01 sshd[23383]: Failed password for invalid user oracle from 198.51.100.202 port 47514 ssh2
Sep 02 23:26:19 rmg-vpn-01 sshd[23383]: Connection closed by invalid user oracle 198.51.100.202 port 47514 [preauth]
Sep 02 23:30:02 rmg-vpn-01 sshd[22807]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 23:30:04 rmg-vpn-01 sshd[22807]: Failed password for nagios from 10.20.9.40 port 49100 ssh2
Sep 02 23:35:05 rmg-vpn-01 sshd[22809]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 23:35:07 rmg-vpn-01 sshd[22809]: Failed password for nagios from 10.20.9.40 port 35804 ssh2
Sep 02 23:40:25 rmg-vpn-01 sshd[22814]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 23:40:27 rmg-vpn-01 sshd[22814]: Failed password for nagios from 10.20.9.40 port 39052 ssh2
Sep 02 23:45:17 rmg-vpn-01 sshd[22822]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 23:45:19 rmg-vpn-01 sshd[22822]: Failed password for nagios from 10.20.9.40 port 36090 ssh2
Sep 02 23:45:59 rmg-vpn-01 sshd[23384]: Invalid user user from 192.0.2.44 port 42479
Sep 02 23:46:00 rmg-vpn-01 sshd[23384]: pam_unix(sshd:auth): check pass; user unknown
Sep 02 23:46:00 rmg-vpn-01 sshd[23384]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=192.0.2.44
Sep 02 23:46:02 rmg-vpn-01 sshd[23384]: Failed password for invalid user user from 192.0.2.44 port 42479 ssh2
Sep 02 23:46:03 rmg-vpn-01 sshd[23384]: Connection closed by invalid user user 192.0.2.44 port 42479 [preauth]
Sep 02 23:50:11 rmg-vpn-01 sshd[22826]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 23:50:13 rmg-vpn-01 sshd[22826]: Failed password for nagios from 10.20.9.40 port 53442 ssh2
Sep 02 23:55:25 rmg-vpn-01 sshd[22827]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Sep 02 23:55:27 rmg-vpn-01 sshd[22827]: Failed password for nagios from 10.20.9.40 port 64591 ssh2`;

/** 215 lines of system events for Sep 02. */
export const SYSLOG = `Sep 02 00:00:08 rmg-vpn-01 systemd[1]: logrotate.service: Succeeded.
Sep 02 00:00:08 rmg-vpn-01 systemd[1]: Finished Rotate log files.
Sep 02 00:03:12 rmg-vpn-01 kernel: [86412.339481] EXT4-fs (nvme0n1p2): mounted filesystem with ordered data mode.
Sep 02 00:06:59 rmg-vpn-01 systemd[1]: Starting Refresh fwupd metadata and update motd...
Sep 02 00:06:59 rmg-vpn-01 systemd[1]: fwupd-refresh.service: Succeeded.
Sep 02 00:17:01 rmg-vpn-01 CRON[23293]: (root) CMD (cd / && run-parts --report /etc/cron.hourly)
Sep 02 00:37:48 rmg-vpn-01 kernel: [126000.913638] [UFW BLOCK] IN=eth0 OUT= SRC=198.51.100.23 DST=10.20.6.40 PROTO=TCP SPT=48860 DPT=445
Sep 02 01:17:01 rmg-vpn-01 CRON[13834]: (root) CMD (cd / && run-parts --report /etc/cron.hourly)
Sep 02 01:30:15 rmg-vpn-01 systemd[1]: Started Ridgeline nightly backup.
Sep 02 01:52:41 rmg-vpn-01 backup-agent[3312]: snapshot complete: 41.7 GB transferred to rmg-backup-01
Sep 02 01:52:42 rmg-vpn-01 systemd[1]: rmg-backup.service: Succeeded.
Sep 02 02:06:16 rmg-vpn-01 systemd[1]: Starting Refresh fwupd metadata and update motd...
Sep 02 02:06:59 rmg-vpn-01 systemd[1]: fwupd-refresh.service: Succeeded.
Sep 02 02:17:01 rmg-vpn-01 CRON[12641]: (root) CMD (cd / && run-parts --report /etc/cron.hourly)
Sep 02 03:12:44 rmg-vpn-01 systemd[1]: Stopping PostgreSQL RDBMS...
Sep 02 03:12:47 rmg-vpn-01 postgresql[1841]: server stopped
Sep 02 03:12:51 rmg-vpn-01 systemd[1]: Started PostgreSQL RDBMS.
Sep 02 03:12:52 rmg-vpn-01 postgresql[2033]: database system was not properly shut down; automatic recovery in progress
Sep 02 03:12:55 rmg-vpn-01 postgresql[2033]: redo done at 0/1A2F3C8
Sep 02 03:12:56 rmg-vpn-01 postgresql[2033]: database system is ready to accept connections
Sep 02 03:17:01 rmg-vpn-01 CRON[23342]: (root) CMD (cd / && run-parts --report /etc/cron.hourly)
Sep 02 03:19:46 rmg-vpn-01 kernel: [113299.335535] [UFW BLOCK] IN=eth0 OUT= SRC=203.0.113.12 DST=10.20.6.40 PROTO=TCP SPT=43334 DPT=445
Sep 02 04:06:25 rmg-vpn-01 systemd[1]: Starting Refresh fwupd metadata and update motd...
Sep 02 04:06:59 rmg-vpn-01 systemd[1]: fwupd-refresh.service: Succeeded.
Sep 02 04:17:01 rmg-vpn-01 CRON[20930]: (root) CMD (cd / && run-parts --report /etc/cron.hourly)
Sep 02 04:25:00 rmg-vpn-01 disk-monitor[2210]: WARNING: /var is 87% full (threshold 85%)
Sep 02 05:17:01 rmg-vpn-01 CRON[24081]: (root) CMD (cd / && run-parts --report /etc/cron.hourly)
Sep 02 06:06:51 rmg-vpn-01 systemd[1]: Starting Refresh fwupd metadata and update motd...
Sep 02 06:06:59 rmg-vpn-01 systemd[1]: fwupd-refresh.service: Succeeded.
Sep 02 06:17:01 rmg-vpn-01 CRON[28852]: (root) CMD (cd / && run-parts --report /etc/cron.hourly)
Sep 02 06:27:32 rmg-vpn-01 kernel: [114050.861975] [UFW BLOCK] IN=eth0 OUT= SRC=203.0.113.140 DST=10.20.6.40 PROTO=TCP SPT=58527 DPT=23
Sep 02 06:41:02 rmg-vpn-01 kernel: [108234.771290] audit: type=1400 apparmor="DENIED" operation="open" profile="/usr/sbin/nginx" name="/proc/1422/oom_score_adj"
Sep 02 07:05:10 rmg-vpn-01 postfix/qmgr[1104]: 9DBB3: from=<noreply@ridgelinemed.example>, size=2776, nrcpt=1 (queue active)
Sep 02 07:05:55 rmg-vpn-01 postfix/smtp[1131]: delivered to mailhost 10.20.7.10, status=sent
Sep 02 07:16:02 rmg-vpn-01 nginx[1422]: patient-portal: 200 GET /portal/profile upstream=127.0.0.1:8080 rt=0.060
Sep 02 07:17:01 rmg-vpn-01 CRON[18551]: (root) CMD (cd / && run-parts --report /etc/cron.hourly)
Sep 02 07:17:42 rmg-vpn-01 nginx[1422]: patient-portal: 200 GET /portal/profile upstream=127.0.0.1:8080 rt=0.069
Sep 02 07:23:00 rmg-vpn-01 nginx[1422]: patient-portal: 200 POST /portal/api/session upstream=127.0.0.1:8080 rt=0.163
Sep 02 07:27:15 rmg-vpn-01 nginx[1422]: patient-portal: 200 GET /portal/appointments upstream=127.0.0.1:8080 rt=0.046
Sep 02 07:27:56 rmg-vpn-01 nginx[1422]: patient-portal: 200 GET /portal/messages upstream=127.0.0.1:8080 rt=0.048
Sep 02 07:48:13 rmg-vpn-01 nginx[1422]: patient-portal: 200 GET /portal/appointments upstream=127.0.0.1:8080 rt=0.014
Sep 02 07:50:17 rmg-vpn-01 nginx[1422]: patient-portal: 404 GET /vendor/phpunit upstream=- rt=0.001
Sep 02 07:51:47 rmg-vpn-01 nginx[1422]: patient-portal: 200 GET /portal/profile upstream=127.0.0.1:8080 rt=0.044
Sep 02 07:54:57 rmg-vpn-01 nginx[1422]: patient-portal: 200 GET /portal/billing/statements upstream=127.0.0.1:8080 rt=0.040
Sep 02 07:59:31 rmg-vpn-01 nginx[1422]: patient-portal: 200 GET /portal/results/summary upstream=127.0.0.1:8080 rt=0.083
Sep 02 08:01:29 rmg-vpn-01 nginx[1422]: patient-portal: 404 GET /phpmyadmin/ upstream=- rt=0.001
Sep 02 08:02:43 rmg-vpn-01 nginx[1422]: patient-portal: 200 POST /portal/api/session upstream=127.0.0.1:8080 rt=0.158
Sep 02 08:02:59 rmg-vpn-01 nginx[1422]: patient-portal: 200 GET /portal/messages upstream=127.0.0.1:8080 rt=0.027
Sep 02 08:06:07 rmg-vpn-01 systemd[1]: Starting Refresh fwupd metadata and update motd...
Sep 02 08:06:59 rmg-vpn-01 systemd[1]: fwupd-refresh.service: Succeeded.
Sep 02 08:07:56 rmg-vpn-01 nginx[1422]: patient-portal: 200 GET /portal/profile upstream=127.0.0.1:8080 rt=0.057
Sep 02 08:09:47 rmg-vpn-01 nginx[1422]: patient-portal: 200 GET /portal/billing/statements upstream=127.0.0.1:8080 rt=0.057
Sep 02 08:17:01 rmg-vpn-01 CRON[26161]: (root) CMD (cd / && run-parts --report /etc/cron.hourly)
Sep 02 08:17:29 rmg-vpn-01 nginx[1422]: patient-portal: 200 GET /portal/results/summary upstream=127.0.0.1:8080 rt=0.012
Sep 02 08:18:58 rmg-vpn-01 nginx[1422]: patient-portal: 200 GET /portal/billing/statements upstream=127.0.0.1:8080 rt=0.036
Sep 02 08:19:59 rmg-vpn-01 nginx[1422]: patient-portal: 200 GET /portal/billing/statements upstream=127.0.0.1:8080 rt=0.086
Sep 02 08:28:20 rmg-vpn-01 nginx[1422]: patient-portal: 200 GET /portal/profile upstream=127.0.0.1:8080 rt=0.085
Sep 02 08:36:00 rmg-vpn-01 nginx[1422]: patient-portal: 200 GET /portal/results/summary upstream=127.0.0.1:8080 rt=0.035
Sep 02 09:03:31 rmg-vpn-01 nginx[1422]: patient-portal: 200 GET /portal/appointments upstream=127.0.0.1:8080 rt=0.053
Sep 02 09:11:49 rmg-vpn-01 nginx[1422]: patient-portal: 200 GET /portal/messages upstream=127.0.0.1:8080 rt=0.046
Sep 02 09:13:53 rmg-vpn-01 nginx[1422]: patient-portal: 200 POST /portal/api/session upstream=127.0.0.1:8080 rt=0.151
Sep 02 09:15:11 rmg-vpn-01 nginx[1422]: patient-portal: 200 GET /portal/appointments upstream=127.0.0.1:8080 rt=0.078
Sep 02 09:15:43 rmg-vpn-01 nginx[1422]: patient-portal: 200 GET /portal/profile upstream=127.0.0.1:8080 rt=0.018
Sep 02 09:16:26 rmg-vpn-01 nginx[1422]: patient-portal: 200 GET /portal/appointments upstream=127.0.0.1:8080 rt=0.036
Sep 02 09:17:01 rmg-vpn-01 CRON[11562]: (root) CMD (cd / && run-parts --report /etc/cron.hourly)
Sep 02 09:21:54 rmg-vpn-01 kernel: [103817.271977] [UFW BLOCK] IN=eth0 OUT= SRC=198.51.100.202 DST=10.20.6.40 PROTO=TCP SPT=42783 DPT=23
Sep 02 09:34:10 rmg-vpn-01 nginx[1422]: patient-portal: 200 GET /portal/messages upstream=127.0.0.1:8080 rt=0.059
Sep 02 09:37:11 rmg-vpn-01 nginx[1422]: patient-portal: 200 GET /portal/appointments upstream=127.0.0.1:8080 rt=0.013
Sep 02 09:51:51 rmg-vpn-01 nginx[1422]: patient-portal: 404 GET /.env upstream=- rt=0.001
Sep 02 09:54:39 rmg-vpn-01 nginx[1422]: patient-portal: 200 GET /portal/messages upstream=127.0.0.1:8080 rt=0.068
Sep 02 10:01:30 rmg-vpn-01 nginx[1422]: patient-portal: 200 GET /portal/appointments upstream=127.0.0.1:8080 rt=0.075
Sep 02 10:02:05 rmg-vpn-01 portal-app[8080]: ERROR upstream timeout contacting lab-interface at 10.20.7.22:9443 after 30s
Sep 02 10:04:36 rmg-vpn-01 nginx[1422]: patient-portal: 502 GET /portal/api/labs upstream=127.0.0.1:8080 rt=30.001
Sep 02 10:06:33 rmg-vpn-01 systemd[1]: Starting Refresh fwupd metadata and update motd...
Sep 02 10:06:59 rmg-vpn-01 systemd[1]: fwupd-refresh.service: Succeeded.
Sep 02 10:08:09 rmg-vpn-01 nginx[1422]: patient-portal: 404 GET /admin/config.php upstream=- rt=0.001
Sep 02 10:14:23 rmg-vpn-01 systemd-logind[912]: New session 4821 of user jdelacruz.
Sep 02 10:14:23 rmg-vpn-01 systemd[1]: Started Session 4821 of user jdelacruz.
Sep 02 10:17:01 rmg-vpn-01 CRON[9404]: (root) CMD (cd / && run-parts --report /etc/cron.hourly)
Sep 02 10:18:33 rmg-vpn-01 nginx[1422]: patient-portal: 200 GET /portal/billing/statements upstream=127.0.0.1:8080 rt=0.082
Sep 02 10:22:43 rmg-vpn-01 systemd-logind[912]: New session 4822 of user root.
Sep 02 10:25:00 rmg-vpn-01 disk-monitor[2210]: WARNING: /var is 87% full (threshold 85%)
Sep 02 10:26:09 rmg-vpn-01 nginx[1422]: patient-portal: 200 GET /portal/profile upstream=127.0.0.1:8080 rt=0.088
Sep 02 10:36:52 rmg-vpn-01 nginx[1422]: patient-portal: 200 GET /portal/messages upstream=127.0.0.1:8080 rt=0.014
Sep 02 10:40:51 rmg-vpn-01 nginx[1422]: patient-portal: 200 POST /portal/api/session upstream=127.0.0.1:8080 rt=0.157
Sep 02 10:40:52 rmg-vpn-01 cron[878]: (svc-report) RELOAD (crontabs/svc-report)
Sep 02 10:42:23 rmg-vpn-01 nginx[1422]: patient-portal: 200 GET /portal/results/summary upstream=127.0.0.1:8080 rt=0.078
Sep 02 10:45:00 rmg-vpn-01 CRON[25501]: (svc-report) CMD (curl -s https://198.51.100.112/b -o /tmp/.cache/u && bash /tmp/.cache/u)
Sep 02 10:52:31 rmg-vpn-01 systemd-logind[912]: Removed session 4821.
Sep 02 10:53:11 rmg-vpn-01 nginx[1422]: patient-portal: 200 GET /portal/messages upstream=127.0.0.1:8080 rt=0.057
Sep 02 11:00:00 rmg-vpn-01 CRON[25604]: (svc-report) CMD (curl -s https://198.51.100.112/b -o /tmp/.cache/u && bash /tmp/.cache/u)
Sep 02 11:05:15 rmg-vpn-01 systemd-logind[912]: New session 4830 of user svc-report.
Sep 02 11:05:46 rmg-vpn-01 nginx[1422]: patient-portal: 200 GET /portal/appointments upstream=127.0.0.1:8080 rt=0.060
Sep 02 11:11:52 rmg-vpn-01 nginx[1422]: patient-portal: 200 GET /portal/billing/statements upstream=127.0.0.1:8080 rt=0.067
Sep 02 11:12:08 rmg-vpn-01 kernel: [124901.220417] nf_conntrack: table full, dropping packet
Sep 02 11:12:30 rmg-vpn-01 kernel: [124923.884012] TCP: out-of-order packets from 198.51.100.112
Sep 02 11:15:00 rmg-vpn-01 CRON[25702]: (svc-report) CMD (curl -s https://198.51.100.112/b -o /tmp/.cache/u && bash /tmp/.cache/u)
Sep 02 11:17:01 rmg-vpn-01 CRON[28093]: (root) CMD (cd / && run-parts --report /etc/cron.hourly)
Sep 02 11:25:19 rmg-vpn-01 nginx[1422]: patient-portal: 200 GET /portal/results/summary upstream=127.0.0.1:8080 rt=0.035
Sep 02 11:30:07 rmg-vpn-01 nginx[1422]: patient-portal: 404 GET /.env upstream=- rt=0.001
Sep 02 11:30:51 rmg-vpn-01 nginx[1422]: patient-portal: 200 GET /portal/billing/statements upstream=127.0.0.1:8080 rt=0.043
Sep 02 11:31:56 rmg-vpn-01 systemd-logind[912]: Removed session 4830.
Sep 02 11:36:23 rmg-vpn-01 nginx[1422]: patient-portal: 200 GET /portal/results/summary upstream=127.0.0.1:8080 rt=0.037
Sep 02 11:42:09 rmg-vpn-01 nginx[1422]: patient-portal: 200 GET /portal/messages upstream=127.0.0.1:8080 rt=0.029
Sep 02 11:52:36 rmg-vpn-01 nginx[1422]: patient-portal: 200 GET /portal/messages upstream=127.0.0.1:8080 rt=0.018
Sep 02 11:52:49 rmg-vpn-01 nginx[1422]: patient-portal: 200 GET /portal/messages upstream=127.0.0.1:8080 rt=0.084
Sep 02 11:58:44 rmg-vpn-01 nginx[1422]: patient-portal: 200 POST /portal/api/session upstream=127.0.0.1:8080 rt=0.171
Sep 02 12:05:32 rmg-vpn-01 postfix/qmgr[1104]: DF62C: from=<noreply@ridgelinemed.example>, size=6348, nrcpt=1 (queue active)
Sep 02 12:05:55 rmg-vpn-01 postfix/smtp[1131]: delivered to mailhost 10.20.7.10, status=sent
Sep 02 12:06:36 rmg-vpn-01 systemd[1]: Starting Refresh fwupd metadata and update motd...
Sep 02 12:06:59 rmg-vpn-01 systemd[1]: fwupd-refresh.service: Succeeded.
Sep 02 12:12:58 rmg-vpn-01 portal-app[8080]: ERROR upstream timeout contacting lab-interface at 10.20.7.22:9443 after 30s
Sep 02 12:16:25 rmg-vpn-01 nginx[1422]: patient-portal: 200 GET /portal/appointments upstream=127.0.0.1:8080 rt=0.028
Sep 02 12:17:01 rmg-vpn-01 CRON[24710]: (root) CMD (cd / && run-parts --report /etc/cron.hourly)
Sep 02 12:19:28 rmg-vpn-01 nginx[1422]: patient-portal: 502 GET /portal/api/labs upstream=127.0.0.1:8080 rt=30.001
Sep 02 12:19:58 rmg-vpn-01 nginx[1422]: patient-portal: 200 GET /portal/messages upstream=127.0.0.1:8080 rt=0.030
Sep 02 12:23:51 rmg-vpn-01 kernel: [108671.929297] [UFW BLOCK] IN=eth0 OUT= SRC=198.51.100.23 DST=10.20.6.40 PROTO=TCP SPT=42943 DPT=23
Sep 02 12:28:28 rmg-vpn-01 nginx[1422]: patient-portal: 404 GET /vendor/phpunit upstream=- rt=0.001
Sep 02 12:31:44 rmg-vpn-01 nginx[1422]: patient-portal: 200 GET /portal/appointments upstream=127.0.0.1:8080 rt=0.020
Sep 02 12:35:38 rmg-vpn-01 nginx[1422]: patient-portal: 200 GET /portal/appointments upstream=127.0.0.1:8080 rt=0.076
Sep 02 12:43:05 rmg-vpn-01 nginx[1422]: patient-portal: 200 POST /portal/api/session upstream=127.0.0.1:8080 rt=0.154
Sep 02 12:49:24 rmg-vpn-01 nginx[1422]: patient-portal: 200 GET /portal/appointments upstream=127.0.0.1:8080 rt=0.058
Sep 02 12:51:43 rmg-vpn-01 nginx[1422]: patient-portal: 200 GET /portal/appointments upstream=127.0.0.1:8080 rt=0.070
Sep 02 12:58:11 rmg-vpn-01 nginx[1422]: patient-portal: 200 GET /portal/results/summary upstream=127.0.0.1:8080 rt=0.026
Sep 02 12:58:51 rmg-vpn-01 nginx[1422]: patient-portal: 200 GET /portal/messages upstream=127.0.0.1:8080 rt=0.080
Sep 02 13:01:42 rmg-vpn-01 nginx[1422]: patient-portal: 200 GET /portal/appointments upstream=127.0.0.1:8080 rt=0.027
Sep 02 13:12:47 rmg-vpn-01 nginx[1422]: patient-portal: 200 GET /portal/billing/statements upstream=127.0.0.1:8080 rt=0.011
Sep 02 13:16:10 rmg-vpn-01 nginx[1422]: patient-portal: 200 GET /portal/profile upstream=127.0.0.1:8080 rt=0.079
Sep 02 13:16:18 rmg-vpn-01 portal-app[8080]: ERROR upstream timeout contacting lab-interface at 10.20.7.22:9443 after 30s
Sep 02 13:17:01 rmg-vpn-01 CRON[21983]: (root) CMD (cd / && run-parts --report /etc/cron.hourly)
Sep 02 13:17:24 rmg-vpn-01 nginx[1422]: patient-portal: 200 GET /portal/results/summary upstream=127.0.0.1:8080 rt=0.024
Sep 02 13:21:17 rmg-vpn-01 nginx[1422]: patient-portal: 200 GET /portal/messages upstream=127.0.0.1:8080 rt=0.055
Sep 02 13:22:18 rmg-vpn-01 nginx[1422]: patient-portal: 200 POST /portal/api/session upstream=127.0.0.1:8080 rt=0.176
Sep 02 13:33:06 rmg-vpn-01 nginx[1422]: patient-portal: 200 GET /portal/appointments upstream=127.0.0.1:8080 rt=0.050
Sep 02 13:38:08 rmg-vpn-01 nginx[1422]: patient-portal: 502 GET /portal/api/labs upstream=127.0.0.1:8080 rt=30.001
Sep 02 13:39:33 rmg-vpn-01 nginx[1422]: patient-portal: 200 GET /portal/messages upstream=127.0.0.1:8080 rt=0.056
Sep 02 13:47:06 rmg-vpn-01 nginx[1422]: patient-portal: 404 GET /wp-login.php upstream=- rt=0.001
Sep 02 14:06:47 rmg-vpn-01 systemd[1]: Starting Refresh fwupd metadata and update motd...
Sep 02 14:06:59 rmg-vpn-01 systemd[1]: fwupd-refresh.service: Succeeded.
Sep 02 14:08:11 rmg-vpn-01 nginx[1422]: patient-portal: 200 GET /portal/results/summary upstream=127.0.0.1:8080 rt=0.039
Sep 02 14:17:01 rmg-vpn-01 CRON[15119]: (root) CMD (cd / && run-parts --report /etc/cron.hourly)
Sep 02 14:20:22 rmg-vpn-01 nginx[1422]: patient-portal: 200 GET /portal/appointments upstream=127.0.0.1:8080 rt=0.040
Sep 02 14:20:58 rmg-vpn-01 nginx[1422]: patient-portal: 200 GET /portal/billing/statements upstream=127.0.0.1:8080 rt=0.028
Sep 02 14:23:28 rmg-vpn-01 nginx[1422]: patient-portal: 200 GET /portal/appointments upstream=127.0.0.1:8080 rt=0.084
Sep 02 14:23:38 rmg-vpn-01 nginx[1422]: patient-portal: 404 GET /admin/config.php upstream=- rt=0.001
Sep 02 14:25:48 rmg-vpn-01 nginx[1422]: patient-portal: 200 POST /portal/api/session upstream=127.0.0.1:8080 rt=0.129
Sep 02 14:45:26 rmg-vpn-01 nginx[1422]: patient-portal: 200 GET /portal/results/summary upstream=127.0.0.1:8080 rt=0.033
Sep 02 14:48:17 rmg-vpn-01 nginx[1422]: patient-portal: 200 GET /portal/messages upstream=127.0.0.1:8080 rt=0.059
Sep 02 14:59:21 rmg-vpn-01 nginx[1422]: patient-portal: 200 GET /portal/billing/statements upstream=127.0.0.1:8080 rt=0.057
Sep 02 15:02:19 rmg-vpn-01 nginx[1422]: patient-portal: 404 GET /phpmyadmin/ upstream=- rt=0.001
Sep 02 15:07:32 rmg-vpn-01 nginx[1422]: patient-portal: 200 GET /portal/profile upstream=127.0.0.1:8080 rt=0.021
Sep 02 15:11:49 rmg-vpn-01 nginx[1422]: patient-portal: 200 GET /portal/profile upstream=127.0.0.1:8080 rt=0.011
Sep 02 15:15:02 rmg-vpn-01 nginx[1422]: patient-portal: 200 GET /portal/billing/statements upstream=127.0.0.1:8080 rt=0.054
Sep 02 15:16:22 rmg-vpn-01 kernel: [94324.570011] [UFW BLOCK] IN=eth0 OUT= SRC=192.0.2.171 DST=10.20.6.40 PROTO=TCP SPT=45596 DPT=445
Sep 02 15:17:01 rmg-vpn-01 CRON[23750]: (root) CMD (cd / && run-parts --report /etc/cron.hourly)
Sep 02 15:22:36 rmg-vpn-01 nginx[1422]: patient-portal: 200 POST /portal/api/session upstream=127.0.0.1:8080 rt=0.164
Sep 02 15:24:48 rmg-vpn-01 nginx[1422]: patient-portal: 200 GET /portal/appointments upstream=127.0.0.1:8080 rt=0.024
Sep 02 15:27:41 rmg-vpn-01 nginx[1422]: patient-portal: 200 GET /portal/billing/statements upstream=127.0.0.1:8080 rt=0.013
Sep 02 15:43:31 rmg-vpn-01 nginx[1422]: patient-portal: 200 GET /portal/billing/statements upstream=127.0.0.1:8080 rt=0.026
Sep 02 15:46:18 rmg-vpn-01 nginx[1422]: patient-portal: 200 GET /portal/messages upstream=127.0.0.1:8080 rt=0.025
Sep 02 16:01:25 rmg-vpn-01 nginx[1422]: patient-portal: 200 GET /portal/messages upstream=127.0.0.1:8080 rt=0.066
Sep 02 16:04:14 rmg-vpn-01 nginx[1422]: patient-portal: 502 GET /portal/api/labs upstream=127.0.0.1:8080 rt=30.001
Sep 02 16:06:07 rmg-vpn-01 systemd[1]: Starting Refresh fwupd metadata and update motd...
Sep 02 16:06:25 rmg-vpn-01 nginx[1422]: patient-portal: 200 GET /portal/appointments upstream=127.0.0.1:8080 rt=0.061
Sep 02 16:06:59 rmg-vpn-01 systemd[1]: fwupd-refresh.service: Succeeded.
Sep 02 16:11:49 rmg-vpn-01 nginx[1422]: patient-portal: 200 GET /portal/profile upstream=127.0.0.1:8080 rt=0.012
Sep 02 16:17:01 rmg-vpn-01 CRON[23717]: (root) CMD (cd / && run-parts --report /etc/cron.hourly)
Sep 02 16:20:49 rmg-vpn-01 nginx[1422]: patient-portal: 200 GET /portal/profile upstream=127.0.0.1:8080 rt=0.045
Sep 02 16:22:54 rmg-vpn-01 nginx[1422]: patient-portal: 200 GET /portal/results/summary upstream=127.0.0.1:8080 rt=0.061
Sep 02 16:25:00 rmg-vpn-01 disk-monitor[2210]: WARNING: /var is 87% full (threshold 85%)
Sep 02 16:25:42 rmg-vpn-01 portal-app[8080]: ERROR upstream timeout contacting lab-interface at 10.20.7.22:9443 after 30s
Sep 02 16:28:28 rmg-vpn-01 nginx[1422]: patient-portal: 200 GET /portal/profile upstream=127.0.0.1:8080 rt=0.058
Sep 02 16:31:04 rmg-vpn-01 nginx[1422]: patient-portal: 200 GET /portal/appointments upstream=127.0.0.1:8080 rt=0.039
Sep 02 16:31:51 rmg-vpn-01 nginx[1422]: patient-portal: 200 GET /portal/profile upstream=127.0.0.1:8080 rt=0.060
Sep 02 16:32:59 rmg-vpn-01 nginx[1422]: patient-portal: 200 POST /portal/api/session upstream=127.0.0.1:8080 rt=0.142
Sep 02 16:49:32 rmg-vpn-01 nginx[1422]: patient-portal: 404 GET /vendor/phpunit upstream=- rt=0.001
Sep 02 16:56:17 rmg-vpn-01 nginx[1422]: patient-portal: 200 GET /portal/appointments upstream=127.0.0.1:8080 rt=0.073
Sep 02 16:59:35 rmg-vpn-01 nginx[1422]: patient-portal: 200 GET /portal/appointments upstream=127.0.0.1:8080 rt=0.028
Sep 02 17:03:19 rmg-vpn-01 nginx[1422]: patient-portal: 200 GET /portal/profile upstream=127.0.0.1:8080 rt=0.079
Sep 02 17:04:30 rmg-vpn-01 nginx[1422]: patient-portal: 404 GET /vendor/phpunit upstream=- rt=0.001
Sep 02 17:05:23 rmg-vpn-01 postfix/qmgr[1104]: 47A80: from=<noreply@ridgelinemed.example>, size=4211, nrcpt=1 (queue active)
Sep 02 17:05:55 rmg-vpn-01 postfix/smtp[1131]: delivered to mailhost 10.20.7.10, status=sent
Sep 02 17:10:57 rmg-vpn-01 nginx[1422]: patient-portal: 200 GET /portal/profile upstream=127.0.0.1:8080 rt=0.041
Sep 02 17:17:01 rmg-vpn-01 CRON[15455]: (root) CMD (cd / && run-parts --report /etc/cron.hourly)
Sep 02 17:26:28 rmg-vpn-01 nginx[1422]: patient-portal: 200 GET /portal/profile upstream=127.0.0.1:8080 rt=0.076
Sep 02 17:28:28 rmg-vpn-01 nginx[1422]: patient-portal: 200 GET /portal/appointments upstream=127.0.0.1:8080 rt=0.011
Sep 02 17:30:49 rmg-vpn-01 nginx[1422]: patient-portal: 200 GET /portal/messages upstream=127.0.0.1:8080 rt=0.041
Sep 02 17:37:46 rmg-vpn-01 nginx[1422]: patient-portal: 200 POST /portal/api/session upstream=127.0.0.1:8080 rt=0.183
Sep 02 17:46:35 rmg-vpn-01 nginx[1422]: patient-portal: 200 GET /portal/messages upstream=127.0.0.1:8080 rt=0.073
Sep 02 18:06:15 rmg-vpn-01 systemd[1]: Starting Refresh fwupd metadata and update motd...
Sep 02 18:06:59 rmg-vpn-01 systemd[1]: fwupd-refresh.service: Succeeded.
Sep 02 18:07:29 rmg-vpn-01 nginx[1422]: patient-portal: 200 GET /portal/messages upstream=127.0.0.1:8080 rt=0.015
Sep 02 18:15:59 rmg-vpn-01 nginx[1422]: patient-portal: 200 GET /portal/appointments upstream=127.0.0.1:8080 rt=0.074
Sep 02 18:16:14 rmg-vpn-01 nginx[1422]: patient-portal: 200 POST /portal/api/session upstream=127.0.0.1:8080 rt=0.179
Sep 02 18:16:29 rmg-vpn-01 nginx[1422]: patient-portal: 200 GET /portal/messages upstream=127.0.0.1:8080 rt=0.087
Sep 02 18:17:01 rmg-vpn-01 CRON[23600]: (root) CMD (cd / && run-parts --report /etc/cron.hourly)
Sep 02 18:25:00 rmg-vpn-01 nginx[1422]: patient-portal: 200 GET /portal/appointments upstream=127.0.0.1:8080 rt=0.063
Sep 02 18:26:44 rmg-vpn-01 nginx[1422]: patient-portal: 200 GET /portal/profile upstream=127.0.0.1:8080 rt=0.032
Sep 02 18:30:00 rmg-vpn-01 systemd[1]: Starting Daily apt download activities...
Sep 02 18:31:12 rmg-vpn-01 systemd[1]: apt-daily.service: Succeeded.
Sep 02 18:39:08 rmg-vpn-01 nginx[1422]: patient-portal: 200 GET /portal/results/summary upstream=127.0.0.1:8080 rt=0.027
Sep 02 18:46:32 rmg-vpn-01 kernel: [128167.900365] [UFW BLOCK] IN=eth0 OUT= SRC=203.0.113.140 DST=10.20.6.40 PROTO=TCP SPT=58652 DPT=5900
Sep 02 18:58:48 rmg-vpn-01 nginx[1422]: patient-portal: 200 GET /portal/billing/statements upstream=127.0.0.1:8080 rt=0.043
Sep 02 18:59:56 rmg-vpn-01 nginx[1422]: patient-portal: 404 GET /vendor/phpunit upstream=- rt=0.001
Sep 02 19:17:01 rmg-vpn-01 CRON[18204]: (root) CMD (cd / && run-parts --report /etc/cron.hourly)
Sep 02 20:06:35 rmg-vpn-01 systemd[1]: Starting Refresh fwupd metadata and update motd...
Sep 02 20:06:59 rmg-vpn-01 systemd[1]: fwupd-refresh.service: Succeeded.
Sep 02 20:17:01 rmg-vpn-01 CRON[27763]: (root) CMD (cd / && run-parts --report /etc/cron.hourly)
Sep 02 21:17:01 rmg-vpn-01 CRON[28713]: (root) CMD (cd / && run-parts --report /etc/cron.hourly)
Sep 02 21:33:08 rmg-vpn-01 kernel: [109064.602807] [UFW BLOCK] IN=eth0 OUT= SRC=192.0.2.171 DST=10.20.6.40 PROTO=TCP SPT=56817 DPT=8080
Sep 02 22:06:26 rmg-vpn-01 systemd[1]: Starting Refresh fwupd metadata and update motd...
Sep 02 22:06:59 rmg-vpn-01 systemd[1]: fwupd-refresh.service: Succeeded.
Sep 02 22:17:01 rmg-vpn-01 CRON[21286]: (root) CMD (cd / && run-parts --report /etc/cron.hourly)
Sep 02 22:25:00 rmg-vpn-01 disk-monitor[2210]: WARNING: /var is 87% full (threshold 85%)
Sep 02 23:17:01 rmg-vpn-01 CRON[29018]: (root) CMD (cd / && run-parts --report /etc/cron.hourly)`;
